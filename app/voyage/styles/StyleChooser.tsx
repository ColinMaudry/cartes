import css from '@/components/css/convertToJs'
import Emoji from '@/components/Emoji'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import { styles } from './styles'
import { ModalCloseButton } from '../UI'

export default function StyleChooser({ style, setStyleChooser, setSnap }) {
	const setSearchParams = useSetSearchParams()
	console.log(style)
	return (
		<section
			css={`
				h2 {
					margin-top: 0;
				}
				position: relative;
			`}
		>
			<ModalCloseButton
				title="Fermer l'encart de choix du style"
				onClick={() => {
					setTimeout(() => setSnap(3), 200)
					setSearchParams({ 'choix du style': undefined })
				}}
			/>
			<h2>Choisir le fond de carte</h2>
			<ul
				style={css`
					display: flex;
					justify-content: center;
					flex-wrap: wrap;
					align-items: center;
					list-style-type: none;
					margin-top: 1rem;
				`}
			>
				{Object.entries(styles).map(([k, { name, imageAlt }]) => {
					const image = k + '.png'

					return (
						<li
							key={k}
							css={`
								margin: 0.2rem;
							`}
						>
							<Link
								href={setSearchParams({ style: k }, true, false)}
								title={'Passer au style ' + name}
								css={`
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
									text-decoration: none;
									color: inherit;
									${style.key === k && `color: var(--color); font-weight: bold`}
								`}
							>
								<img
									src={'/styles/' + image}
									width="50"
									height="50"
									alt={imageAlt}
									css={`
										width: 6rem;
										height: 6rem;
										border-radius: 0.4rem;
										border: 1px solid var(--lighterColor);
										${style.key === k &&
										`border: 3px solid var(--color);
								`}
									`}
								/>
								<div>{name}</div>
							</Link>
						</li>
					)
				})}
			</ul>
		</section>
	)
}
