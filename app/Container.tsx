'use client'

/**
 * This component is a client component to hold state but does
 * not require the maplibre instance
 *
 * Depends on what we want :
 * - make our servers work and serve a finished content page to the user and
 * google's pagespeed
 * - let requests be done by the user browser and start loading the map more
 * quickly
 *
 * Due to Googlebot's problem indexing our pages (the live test captures showed
 * just the map and an empty sheet), we've started to generate some pages on the
 * server, see page.ts. It's the current tradeof.
 *
 * Note : some requests will be made on the server to generate metadata, doing
 * them again client side is a bit of a waste (not totally, because data has to
 * be transmitted to the user anyway ; it's data vs code)
 *
 * If the server path is chosen, useStates become fetch. Some useStates can't be
 * server side, because used by client components that need the map e.g. for the
 * bbox
 **/

import { useMemo, useRef, useState } from 'react'

import { getCategories } from '@/components/categories'
import ModalSwitch from './ModalSwitch'
import { ContentWrapper, MapContainer } from './UI'
import { useZoneImages } from './ZoneImages'
import useSetItineraryModeFromUrl from './itinerary/useSetItineraryModeFromUrl'

import { mapLibreBboxToOverpass } from '@/components/mapUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useDebounce } from '@/components/utils'
import { useLocalStorage } from 'usehooks-ts'
import FocusedImage from './FocusedImage'
import { initialSnap } from './ModalSheet'
import PanoramaxLoader from './PanoramaxLoader'
import SafeMap from './SafeMap'
import { defaultZoom } from './effects/useAddMap'
import useFetchTransportMap, {
	useFetchAgencyAreas,
} from './effects/useFetchTransportMap'
import useGeocodeRightClick from './effects/useGeocodeRightClick'
import useOsmRequest from './effects/useOsmRequest'
import useOverpassRequest from './effects/useOverpassRequest'
import useFetchItinerary from './itinerary/useFetchItinerary'
import Meteo from './meteo/Meteo'
import { getStyle } from './styles/styles'
import useTransportStopData from './transport/useTransportStopData'
import useWikidata from './useWikidata'
import { useSearchParams } from 'next/navigation'
import { useWhatChanged } from '@/components/utils/useWhatChanged'
import { computeCenterFromBbox } from './utils'

// We don't want to redraw <Content instantaneously on map zoom or drag
const contentDebounceDelay = 500

export default function Container(props) {
	const { state: givenState, agencyEntry } = props

	const setSearchParams = useSetSearchParams()
	const clientSearchParams = useSearchParams()

	const searchParams = useMemo(
		() => Object.fromEntries(clientSearchParams.entries()),
		[clientSearchParams.toString()]
	)

	const [focusedImage, focusImage] = useState(null)
	const [isMapLoaded, setMapLoaded] = useState(false)
	const [lastGeolocation, setLastGeolocation] = useLocalStorage(
		'lastGeolocation',
		{ center: null, zoom: null }
	)
	const [bbox, setBbox] = useState(null)
	const debouncedBbox = useDebounce(bbox, contentDebounceDelay)
	const [zoom, setZoom] = useState(lastGeolocation.zoom || defaultZoom)
	const debouncedZoom = useDebounce(zoom, contentDebounceDelay)
	const [bboxImages, setBboxImages] = useState([])
	const [latLngClicked, setLatLngClicked] = useState(null)
	const resetClickedPoint = () => setSearchParams({ clic: undefined })
	const [panoramaxPosition, setPanoramaxPosition] = useState(null)
	console.log('purple panoramaxPosition', panoramaxPosition)

	// For the mobile sheet, we need it in Map, hence the definition here
	const [trackedSnap, setTrackedSnap] = useState(initialSnap)

	const geocodedClickedPoint = useGeocodeRightClick(searchParams.clic)

	const [geolocation, setGeolocation] = useState(null)

	const [safeStyleKey, setSafeStyleKey] = useState(null)
	console.log('lightpink ssk', safeStyleKey)
	const [localStorageStyleKey] = useLocalStorage('style', null)
	const styleKey = searchParams.style || localStorageStyleKey || 'france'
	const style = getStyle(styleKey)

	const styleChooser = searchParams['choix du style'] === 'oui',
		setStyleChooser = (state) =>
			setSearchParams({ 'choix du style': state ? 'oui' : undefined })

	const center = useMemo(
		() => (bbox ? computeCenterFromBbox(bbox) : lastGeolocation.center),
		[bbox, lastGeolocation.center]
	)
	// In this query param is stored an array of points. If only one, it's just a
	// place focused on.
	const [state, setState] = useState(givenState)
	console.log('lightgreen state', state)

	const allez = useMemo(() => {
		return searchParams.allez ? searchParams.allez.split('->') : []
	}, [searchParams.allez])

	const [bikeRouteProfile, setBikeRouteProfile] = useState('safety')

	// TODO This could be a simple derived variable but we seem to be using it in a
	// button down below, not sure if it's relevant, why not wait for the url to
	// change ?
	const [isItineraryMode, setIsItineraryMode] = useState(false)

	// TODO this hook must be split between useFetchItineraryData and
	// useDrawItinerary like useTransportMap was
	const [resetItinerary, routes, date] = useFetchItinerary(
		searchParams,
		state,
		bikeRouteProfile
	)

	const itinerary = {
		bikeRouteProfile,
		isItineraryMode,
		setIsItineraryMode,
		reset: resetItinerary,
		routes,
		date,
	}

	useSetItineraryModeFromUrl(allez, setIsItineraryMode)

	const [categoryNames, categoryObjects] = getCategories(searchParams)

	const vers = useMemo(() => state?.slice(-1)[0], [state])
	const choice = vers && vers.choice
	const target = useMemo(
		() => choice && [choice.longitude, choice.latitude],
		[choice]
	)

	useOsmRequest(allez, state, setState)

	const osmFeature = vers?.osmFeature

	const wikidata = useWikidata(osmFeature, state)

	console.log('wikidata3', wikidata, osmFeature)

	const panoramaxOsmTag = osmFeature?.tags?.panoramax

	const panoramaxId = searchParams.panoramax
	const [zoneImages, panoramaxImages, resetZoneImages] = useZoneImages({
		latLngClicked,
		setLatLngClicked,
		panoramaxOsmTag,
		panoramaxId,
		wikidata,
	})

	const transportStopData = useTransportStopData(osmFeature)
	const clickedStopData = transportStopData[0] || []

	const isTransportsMode = styleKey === 'transports'

	const fetchAll = searchParams.tout
	const transportsData = useFetchTransportMap(
		isTransportsMode,
		searchParams.day,
		bbox,
		searchParams.agence,
		searchParams.noCache,
		fetchAll,
		agencyEntry
	)
	const agencyAreas = useFetchAgencyAreas(isTransportsMode)

	// TODO reintroduce gare display through the transport style option + the bike
	// mode below
	const gares = []

	const clickedGare = null
	const clickGare = (uic) => null // TODO train station + itinerary to be implemented again // setSearchParams({ gare: uic })

	/* TODO reintroduce this very cool mode
	const [bikeRoute, setBikeRoute] = useState(null)
	useEffect(() => {
		if (!target || !clickedGare) return

		const [lon1, lat1] = clickedGare.coordonnées,
			[lon2, lat2] = target

		async function fetchBikeRoute() {
			const url = `https://brouter.osc-fr1.scalingo.io/brouter?lonlats=${lon1},${lat1}|${lon2},${lat2}&profile=${bikeRouteProfile}&alternativeidx=0&format=geojson`
			const res = await fetch(url)
			const json = await res.json()
			setBikeRoute(json)
		}

		fetchBikeRoute()
	}, [target, clickedGare, bikeRouteProfile])
	*/

	/* The bbox could be computed from the URL hash, for this to run on the
	 * server but I'm not sure we want it, and I'm not sure Next can get the hash
	 * server-side, it's a client-side html element */
	const simpleArrayBbox = useMemo(
		() => debouncedBbox && mapLibreBboxToOverpass(debouncedBbox), // TODO Ideally, just above https://maplibre.org/maplibre-gl-js/docs/API/type-aliases/FlyToOptions/
		[debouncedBbox]
	)

	const [quickSearchFeaturesMap] = useOverpassRequest(
		simpleArrayBbox,
		categoryObjects
	)

	const containerRef = useRef()
	return (
		<div ref={containerRef}>
			<MapContainer $isMapLoaded={isMapLoaded}>
				<ContentWrapper>
					<ModalSwitch
						{...{
							setState,
							state,
							clickedGare,
							clickGare,
							//bikeRoute,
							latLngClicked,
							setLatLngClicked,
							setBikeRouteProfile,
							bikeRouteProfile,
							zoneImages,
							panoramaxImages,
							resetZoneImages,
							zoom: debouncedZoom,
							setZoom,
							searchParams,
							style,
							styleKey,
							styleChooser,
							setStyleChooser,
							itinerary,
							transportStopData: clickedStopData[1],
							geocodedClickedPoint,
							resetClickedPoint,
							transportsData,
							agencyAreas,
							geolocation,
							bboxImages,
							bbox: debouncedBbox,
							focusImage,
							vers,
							osmFeature,
							quickSearchFeaturesMap,
							containerRef,
							trackedSnap,
							setTrackedSnap,
							wikidata,
						}}
					/>
				</ContentWrapper>
				<Meteo coordinates={center} />
				{focusedImage && <FocusedImage {...{ focusedImage, focusImage }} />}
				{searchParams.panoramax && (
					<PanoramaxLoader
						id={searchParams.panoramax}
						onMove={(func) => setPanoramaxPosition(func)}
					/>
				)}
				<SafeMap
					{...{
						trackedSnap,
						searchParams,
						state,
						vers,
						target,
						osmFeature,
						zoom,
						isTransportsMode,
						transportStopData,
						transportsData,
						agencyAreas,
						clickedStopData,
						bikeRouteProfile,
						bbox,
						setBbox,
						setBboxImages,
						gares,
						clickGare,
						clickedGare,
						focusImage,
						styleKey,
						safeStyleKey,
						styleChooser,
						setStyleChooser,
						itinerary,
						geocodedClickedPoint,
						setGeolocation,
						setZoom,
						center,
						setState,
						setLatLngClicked,
						setSafeStyleKey,
						quickSearchFeaturesMap,
						panoramaxPosition,
						setMapLoaded,
						wikidata,
						setLastGeolocation,
						lastGeolocation,
					}}
				/>
			</MapContainer>
		</div>
	)
}
