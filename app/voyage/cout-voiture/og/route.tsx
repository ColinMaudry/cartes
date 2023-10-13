import { getSituation } from '@/components/utils/simulationUtils'
import { ImageResponse } from 'next/server'
import Publicodes, { formatValue } from 'publicodes'
import coutRules from '@/app/voyage/cout-voiture/data/rules'
import css from '@/components/css/convertToJs'
import BeautifulSituation from '@/components/BeautifulSituation'
import voitureRules from '../data/rules'

const futurecoRules = 'https://futureco-data.netlify.app/co2.json'

export const runtime = 'edge'

const getRules = async (dottedName) => {
	if (dottedName === 'trajet voiture . coût trajet par personne')
		return voitureRules

	const rulesRequest = await fetch(futurecoRules, { mode: 'cors' }),
		rules = await rulesRequest.json()
	return rules
}
export async function GET(request) {
	const { searchParams } = new URL(request.url)

	const params = Object.fromEntries(searchParams)
	const { dottedName, title, emojis, ...encodedSituation } = params

	const rules = await getRules(dottedName)
	const engine = new Publicodes(rules)

	const validatedSituation = getSituation(encodedSituation, rules)
	console.log(title, emojis, validatedSituation)
	const nodeValue = engine
			.setSituation(validatedSituation)
			.evaluate(dottedName).nodeValue,
		value = formatValue(nodeValue, { precision: 1 })

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					height: '100%',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #fff1f1)',
					fontSize: 100,
					letterSpacing: -2,
					fontWeight: 700,
					textAlign: 'center',
					lineHeight: 0.8,
				}}
			>
				<div
					style={css(`
					 font-size: 180;
					`)}
				>
					{emojis}
				</div>
				<div
					style={{
						backgroundImage:
							'linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))',
						backgroundClip: 'text',
						'-webkit-background-clip': 'text',
						color: 'transparent',
					}}
				>
					{title}
				</div>
				<div
					style={css`
						font-size: 30;
						display: flex;
						margin-top: 1rem;
					`}
				>
					<BeautifulSituation {...{ validatedSituation, rules }} />
				</div>
				<div
					style={css`
						display: flex;
						align-items: center;
						margin-top: 1rem;
					`}
				>
					<span>{value}</span>
					<small
						style={css`
							font-size: 60;
							margin-left: 1rem;
						`}
					>
						kg CO2e
					</small>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			// Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
			// Default to 'twemoji'
			emoji: 'openmoji',
		}
	)
}
