// Server components here
import { ResolvingMetadata } from 'next/dist/lib/metadata/types/metadata-interface'
import { Props } from 'next/script'
import Container from './Container'
import { stepOsmRequest } from './stepOsmRequest'
import getName from './osm/getName'
import fetchOgImage from '@/components/fetchOgImage'
import getUrl from './osm/getUrl'
import { gtfsServerUrl } from './serverUrls'
import { decodeTransportsData } from './transport/decodeTransportsData'
import {
	getLinesSortedByFrequency,
	getTransitFilter,
	transitFilters,
} from './transport/TransitFilter'
import buildDescription from '@/components/osm/buildDescription'

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	if (searchParams.style === 'elections')
		return {
			title:
				'Cartes des résultats du premier tour, des circonscriptions et des candidat(e)s aux législatives 2024',
			description:
				'Qui est arrivé en tête dans ma circonscription ? Trouvez en un clic votre circonscription et la liste des candidats et leur score au vote des législatives 2024 le 30 juin 2024',
			openGraph: {
				images: ['/resultats-1er-tour-legislatives-2024.png'],
				url: '/elections-legislatives-2024',
			},
		}
	if (searchParams.transports === 'oui' && searchParams.agence != null) {
		const url = `${gtfsServerUrl}/agencyArea/${searchParams.agence}`
		console.log('Will fetch this URL for metadata', url)

		const request = await fetch(url)
		const json = await request.json()
		const [
			,
			{
				agency: { agency_name },
				features,
			},
		] = decodeTransportsData([searchParams.agence, json])

		const lines = features.filter(
			(feature) =>
				feature && feature.geometry?.type === 'LineString' && feature.properties
		)
		const heavyFilter = getTransitFilter((key) =>
				['tram', 'métro'].includes(key)
			).filter,
			hasHeavy = lines.filter((feature) => heavyFilter(feature)).length > 0

		const transportType = hasHeavy ? `transport (bus, tram, métro)` : 'bus'
		const mainLines = getLinesSortedByFrequency(lines).slice(0, 10),
			mainLinesNames = mainLines.map(
				({ properties }) => properties.route_short_name
			)
		return {
			title: `Plan du réseau de ${transportType} ${agency_name}`,
			description: `Plan complet des lignes de transport en commun du réseau de ${transportType} ${agency_name} : lignes ${mainLinesNames.join(
				', '
			)}`,
		}
	}

	const allez = searchParams.allez?.split('->')

	if (!allez?.length) return null
	const vers = allez[allez.length - 1]
	const step = await stepOsmRequest(vers)

	if (!step) return null

	const osmFeature = step.osmFeature
	const tags = osmFeature?.tags || {}
	const modifiedTime = osmFeature?.timestamp
	const title = step.name || getName(tags),
		description = buildDescription(step.osmFeature)

	const image = tags.image || (await fetchOgImage(getUrl(tags)))

	const searchParamsString = new URLSearchParams(searchParams).toString()
	const metadata = {
		title: title,
		description,
		openGraph: {
			images: image ? [image] : undefined,
			modifiedTime,
			type: 'article',
			// TODO next doesn't understand this link with only searchParams. Could be
			// symtomatic of a bad choice we made : the id / name should be in the
			// path, not the searchParams ? Could it lead to RSC generation ?
			//url: '/?' + searchParamsString,
		},
	}
	return metadata
}

const Page = async ({ searchParams }) => {
	const allez = searchParams.allez ? searchParams.allez.split('->') : []

	const newPoints = allez.map((point) => stepOsmRequest(point))
	const state = await Promise.all(newPoints).catch((error) => {
		console.log('Error fetching osm nodes from "allez" searchParam ', allez)
		console.log(error)
		return [] // fallback to client side
	})

	return (
		<main
			style={{
				height: '100%',
				background: '#dfecbe',
				minHeight: '100vh',
			}}
		>
			<Container searchParams={searchParams} state={state} />
		</main>
	)
}

export default Page
