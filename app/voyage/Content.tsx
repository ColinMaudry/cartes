import useSetSearchParams from '@/components/useSetSearchParams'
import { getThumb } from '@/components/wikidata'
import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import BikeRouteRésumé from './BikeRouteRésumé'
import ClickedPoint from './ClickedPoint'
import { ExplanationWrapper } from './ContentUI'
import Explanations from './explanations.mdx'
import { FeatureImage } from './FeatureImage'
import GareInfo from './GareInfo'
import Itinerary from './itinerary/Itinerary'
import { defaultState } from './Map'
import OsmFeature from './OsmFeature'
import PlaceSearch from './PlaceSearch'
import QuickFeatureSearch from './QuickFeatureSearch'
import SetDestination from './SetDestination'
import StyleChooser from './styles/StyleChooser'
import { DialogButton, ModalCloseButton } from './UI'
import useOgImageFetcher from './useOgImageFetcher'
import useWikidata from './useWikidata'
import { ZoneImages } from './ZoneImages'

const getMinimumQuickSearchZoom = (mobile) => (mobile ? 10.5 : 12) // On a small screen, 70 %  of the tiles are not visible, hence this rule

export default function Content({
	latLngClicked,
	setLatLngClicked,
	clickedGare,
	bikeRoute,
	setBikeRouteProfile,
	bikeRouteProfile,
	clickGare,
	osmFeature,
	setOsmFeature,
	zoneImages,
	panoramaxImages,
	resetZoneImages,
	state,
	setState,
	zoom,
	sideSheet, // This gives us the indication that we're on the desktop version, where the Content is on the left, always visible, as opposed to the mobile version where a pull-up modal is used
	searchParams,
	snap,
	setSnap = (snap) => null,
	openSheet = () => null,
	setStyleChooser,
	style,
	styleChooser,
	itinerary,
	transportStopData,
	clickedPoint,
	resetClickedPoint,
}) {
	const url = osmFeature?.tags?.website || osmFeature?.tags?.['contact:website']
	const ogImages = useOgImageFetcher(url),
		ogImage = ogImages[url],
		tagImage = osmFeature?.tags?.image,
		mainImage = tagImage || ogImage // makes a useless request for ogImage that won't be displayed to prefer mainImage : TODO also display OG

	const [tutorials, setTutorials] = useLocalStorage('tutorials', {})
	const introductionRead = tutorials.introduction,
		clickTipRead = true || tutorials.clickTip
	const wikidata = useWikidata(osmFeature, state)

	const setSearchParams = useSetSearchParams()
	useEffect(() => {
		if (!introductionRead) setSnap(1)
	}, [introductionRead, setSnap])

	const choice = state.vers?.choice

	const wikidataPictureUrl = wikidata?.pictureUrl
	const wikiFeatureImage =
		!tagImage && // We can't easily detect if tagImage is the same as wiki* image
		// e.g.
		// https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/Cathédrale Sainte-Croix d'Orléans 2008 PD 33.JPG&width=500
		// https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Cathédrale_Sainte-Croix_d'Orléans_2008_PD_33.JPG/300px-Cathédrale_Sainte-Croix_d'Orléans_2008_PD_33.JPG
		// are the same but with a different URL
		// hence prefer tag image, but this is questionable
		osmFeature &&
		(osmFeature.tags?.wikimedia_commons
			? getThumb(osmFeature.tags.wikimedia_commons, 500)
			: wikidataPictureUrl)

	const hasContent =
		choice ||
		osmFeature ||
		zoneImages ||
		panoramaxImages ||
		!clickTipRead ||
		clickedPoint

	const hasFeature = choice || osmFeature
	const hasDestination = choice || osmFeature || clickedPoint,
		yo = console.log('bleu destination', clickedPoint),
		destination = hasDestination && {
			longitude: hasDestination.longitude,
			latitude: hasDestination.latitude,
		}

	const showSearch = sideSheet || !hasFeature

	const minimumQuickSearchZoom = getMinimumQuickSearchZoom(!sideSheet)

	useEffect(() => {
		if (clickedPoint) {
			setSnap(1)
		}
	}, [clickedPoint, setSnap])
	useEffect(() => {
		if (!showSearch) return
		if (zoom > minimumQuickSearchZoom) {
			setSnap(2)
		}
	}, [showSearch, zoom])

	if (!introductionRead)
		return (
			<ExplanationWrapper>
				<Explanations />
				<DialogButton
					onClick={() => setTutorials({ ...tutorials, introduction: true })}
				>
					OK
				</DialogButton>
			</ExplanationWrapper>
		)

	return (
		<section>
			{showSearch && (
				<section>
					{!choice && (
						<PlaceSearch
							{...{
								state,
								setState,
								sideSheet,
								setSnap,
								zoom,
								setSearchParams,
								searchParams,
							}}
						/>
					)}
					{/* TODO reuse the name overlay and only that ?
					wikidataPictureUrl && (
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{}}
							key={wikidataPictureUrl}
							exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
						>
							<ImageWithNameWrapper>
								<CityImage
									src={wikidataPictureUrl}
									alt={`Une photo emblématique de la destination, ${state.vers.choice?.name}`}
								/>
								<Destination>
									<NextImage src={destinationPoint} alt="Vers" />
									<h2>{osmFeature.tags.name}</h2>
								</Destination>
							</ImageWithNameWrapper>
						</motion.div>
					)
					*/}
					{zoom > minimumQuickSearchZoom && (
						<QuickFeatureSearch
							{...{
								searchParams,
								searchInput: state.vers.inputValue,
								setSnap,
							}}
						/>
					)}
				</section>
			)}

			<Itinerary
				{...{ itinerary, bikeRouteProfile, setBikeRouteProfile, searchParams }}
			/>

			{styleChooser ? (
				<StyleChooser {...{ setStyleChooser, style }} />
			) : (
				hasContent && (
					<section
						css={`
							padding-top: 1.6rem;
							position: relative;
						`}
					>
						{(choice || osmFeature) && (
							<ModalCloseButton
								title="Fermer l'encart point d'intéret"
								onClick={() => {
									console.log('will yo')
									setSearchParams({ lieu: undefined })
									setTimeout(() => setOsmFeature(null), 300)
									setLatLngClicked(null)
									resetZoneImages()
									console.log('will set default stat')
									setState(defaultState)
									openSheet(false)
								}}
							/>
						)}
						{mainImage && (
							<FeatureImage
								src={mainImage}
								css={`
									width: 100%;
									height: 6rem;
									@media (min-height: 800px) {
										height: 9rem;
									}
									object-fit: cover;
								`}
							/>
						)}
						{wikiFeatureImage && (
							<FeatureImage
								src={wikiFeatureImage}
								css={`
									width: 100%;
									height: 6rem;
									@media (min-height: 800px) {
										height: 9rem;
									}
									object-fit: cover;
								`}
							/>
						)}
						<ZoneImages
							zoneImages={zoneImages}
							panoramaxImages={panoramaxImages}
						/>
						{hasDestination && (
							<SetDestination
								destination={destination}
								origin={state.depuis.geolocated}
							/>
						)}
						{clickedGare ? (
							<div>
								<ModalCloseButton
									title="Fermer l'encart gare"
									onClick={() => {
										console.log('will yo2')
										clickGare(null)
									}}
								/>
								{bikeRoute && (
									<BikeRouteRésumé
										{...{
											data: bikeRoute,
											bikeRouteProfile,
											setBikeRouteProfile,
										}}
									/>
								)}
								<GareInfo clickedGare={clickedGare} />
							</div>
						) : osmFeature ? (
							<OsmFeature
								data={osmFeature}
								transportStopData={transportStopData}
							/>
						) : clickedPoint ? (
							<ClickedPoint
								clickedPoint={clickedPoint}
								origin={state.depuis.geolocated}
							/>
						) : (
							!clickTipRead && (
								<div>
									<p
										css={`
											max-width: 20rem;
										`}
									>
										Cliquez sur un point d'intérêt ou saisissez une destination
										puis explorez les gares autour.
									</p>
									<DialogButton
										onClick={() =>
											setTutorials({ ...tutorials, clickTip: true })
										}
									>
										OK
									</DialogButton>
								</div>
							)
						)}
					</section>
				)
			)}
		</section>
	)
}
