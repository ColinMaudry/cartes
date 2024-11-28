 import useSetSearchParams from '@/components/useSetSearchParams'
 
 export function Geolocate() {
 	const setSearchParams = useSetSearchParams()
 	return (
 		<button onClick={() => setSearchParams({ geoloc: 'oui' })}>
 			<span
 				css={css`
 					background-position: 50%;
 					background-repeat: no-repeat;
 					display: block;
 					display: inline-block;
 					width: 1rem;
 					height: 1rem;
 					margin-right: 0.4rem;
 					vertical-align: sub;
 					background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='29' fill='%23333' viewBox='0 0 20 20'%3E%3Cpath d='M10 4C9 4 9 5 9 5v.1A5 5 0 0 0 5.1 9H5s-1 0-1 1 1 1 1 1h.1A5 5 0 0 0 9 14.9v.1s0 1 1 1 1-1 1-1v-.1a5 5 0 0 0 3.9-3.9h.1s1 0 1-1-1-1-1-1h-.1A5 5 0 0 0 11 5.1V5s0-1-1-1m0 2.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 1 1 0-7'/%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/svg%3E");
 				`}
 			/>
 			Me géolocaliser
 		</button>
 	)
 }
