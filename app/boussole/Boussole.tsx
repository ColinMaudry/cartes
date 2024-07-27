'use client'

import { useEffect, useState } from 'react'
import { Compass } from './UI'

export default function Boussole() {
	const [pointDegree, setPointDegree] = useState(0)
	const [compass, setCompass] = useState()
	const [isIOS, setIsIOS] = useState(false)

	useEffect(() => {
		setIsIOS(
			navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
				navigator.userAgent.match(/AppleWebKit/)
		)
	}, [])

	const locationHandler = (position) => {
		const { latitude, longitude } = position.coords
		setPointDegree(calcDegreeToPoint(latitude, longitude))

		if (pointDegree < 0) {
			setPointDegree(pointDegree + 360)
		}
	}

	const handler = (e) => {
		const compass = e.webkitCompassHeading || Math.abs(e.alpha - 360)
		setCompass(compass)
	}

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(locationHandler)

		if (!isIOS) {
			window.addEventListener('deviceorientationabsolute', handler, true)
		}
		return () => {
			if (!isIOS) {
				window.removeEventListener('deviceorientationabsolute', handler, true)
			}
		}
	}, [isIOS])

	const startCompass = () => {
		if (isIOS) {
			DeviceOrientationEvent.requestPermission()
				.then((response) => {
					if (response === 'granted') {
						window.addEventListener('deviceorientation', handler, true)
					} else {
						alert('has to be allowed!')
					}
				})
				.catch(() => alert('not supported'))
		}
	}

	// What is this ?
	const myPointOpacity =
		// ±15 degree
		(pointDegree < Math.abs(compass) && pointDegree + 15 > Math.abs(compass)) ||
		pointDegree > Math.abs(compass + 15) ||
		pointDegree < Math.abs(compass)
			? 0
			: pointDegree
			? 1
			: false

	return (
		<div>
			<Compass>
				<div className="arrow"></div>
				<div
					className="compass-circle"
					css={
						compass != null
							? `
transform: translate(-50%, -50%) rotate(${-compass}deg) !important`
							: ''
					}
				></div>
				<div
					className="my-point"
					css={myPointOpacity ? `opacity: ${myPointOpacity} !important` : ''}
				></div>
			</Compass>

			<button onClick={() => startCompass()}>Utiliser la boussole</button>
		</div>
	)
}

function calcDegreeToPoint(latitude, longitude) {
	// Vierzon's geolocation, close to the center of the french hexagon
	const point = {
		lat: 47.21917,
		lng: 2.07564,
	}

	const phiK = (point.lat * Math.PI) / 180.0
	const lambdaK = (point.lng * Math.PI) / 180.0
	const phi = (latitude * Math.PI) / 180.0
	const lambda = (longitude * Math.PI) / 180.0
	const psi =
		(180.0 / Math.PI) *
		Math.atan2(
			Math.sin(lambdaK - lambda),
			Math.cos(phi) * Math.tan(phiK) -
				Math.sin(phi) * Math.cos(lambdaK - lambda)
		)
	return Math.round(psi)
}
