// https://codepen.io/cssjockey/pen/bGbmop
// https://shhdharmen.github.io/keyboard-css/#states
// https://codepen.io/vladracoare/pen/jOPmMap

import Link from 'next/link'

import { utils } from 'publicodes'
import CardCheckbox from './CardCheckbox'
import { CardStyle } from './CardUI'
const { encodeRuleName } = utils

const Card = ({ data: { titre, icônes, formule, notes }, state, setState }) => {
	return (
		<li
			css={`
				margin: 1.4rem;
				list-style-type: none;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				label {
					font-size: 200%;
					margin-top: 1rem;
				}
			`}
			key={titre}
		>
			<Link
				href={`/national/action/${encodeRuleName(titre.toLowerCase())}`}
				css={`
					text-decoration: none;
					visibility: ${(formule || notes) != null ? 'visible' : 'hidden'};
					text-align: center;
					color: var(--color);
				`}
			>
				<CardStyle {...{ isChecked: state[titre], formule }}>
					<ButtonContent {...{ icônes, titre, formule }} />
				</CardStyle>
			</Link>
			{formule != null && (
				<CardCheckbox
					{...{ isChecked: state[titre], titre, formule, setState }}
				/>
			)}
		</li>
	)
}

const ButtonContent = ({ icônes, titre, formule }) => (
	<div className="button__content">
		<div className="button__icon">{icônes}</div>

		<p className="button__text">{titre}</p>
		<div className="button__figure">- {formule} %</div>
	</div>
)

export default Card
