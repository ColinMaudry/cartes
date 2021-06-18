import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { correctValue } from '../../components/publicodesUtils'
import { humanWeight } from './HumanWeight'
const { encodeRuleName, decodeRuleName } = utils

export const disabledAction = (flatRule, nodeValue) =>
	flatRule.formule == null ? false : nodeValue === 0 || nodeValue === false

export default ({ evaluation, total, rule, effort }) => {
	const rules = useSelector((state) => state.rules),
		{ nodeValue, dottedName, title, unit } = evaluation,
		{ icônes: icons } = rule

	const flatRule = rules[dottedName],
		noFormula = flatRule.formule == null,
		disabled = disabledAction(flatRule, nodeValue)

	return (
		<Link
			css={`
				${disabled
					? `
					img {
					filter: grayscale(1);
					}
					color: var(--grayColor);
					h2 {
					  color: var(--grayColor);
					}
					opacity: 0.8;`
					: ''}
				text-decoration: none;
				width: 100%;
			`}
			to={'/actions/' + encodeRuleName(dottedName)}
		>
			<motion.div
				animate={{ scale: [0.85, 1] }}
				transition={{ duration: 0.2, ease: 'easeIn' }}
				className="ui__ card"
				css={`
					margin: 1rem auto;
					border-radius: 0.6rem;
					padding: 0.6rem;

					text-align: center;
					font-size: 100%;
					h2 {
						font-size: 130%;
						font-weight: normal;
						margin: 0.5rem 0;
						text-align: left;
					}
					> h2 > span > img {
						margin-right: 0.4rem !important;
					}
				`}
			>
				<h2>{title}</h2>
				<div
					css={`
						display: flex;
						justify-content: start;
						align-items: center;
					`}
				>
					{icons && (
						<div
							css={`
								font-size: 200%;
								width: 5rem;
								margin-right: 1rem;
								img {
									margin-top: 0.4rem !important;
								}
							`}
						>
							{emoji(icons)}
						</div>
					)}
					<div
						css={`
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							align-items: flex-start;
							width: 75%;
							max-width: 16rem;
						`}
					>
						{effort && (
							<div
								css={`
									display: flex;
									justify-content: space-start;
									width: 100%;
									div:first-child {
										width: 6rem;
									}
									img {
										font-size: 120%;
									}
								`}
							>
								<div>Difficulté&nbsp;</div>
								<span>{[...new Array(effort)].map((i) => emoji('💪'))}</span>
							</div>
						)}
						<ActionValue {...{ total, nodeValue, unit, disabled, noFormula }} />
					</div>
				</div>
			</motion.div>
		</Link>
	)
}
const ActionValue = ({
	total,
	nodeValue: rawValue,
	unit: rawUnit,
	disabled,
	noFormula,
}) => {
	const correctedValue = correctValue({ nodeValue: rawValue, unit: rawUnit })
	const [value, unit] = humanWeight(correctedValue),
		relativeValue = Math.round(100 * (correctedValue / total))

	return (
		<div
			css={`
				strong {
					background: var(--lightColor);
					border-radius: 0.3rem;
					color: var(--textColor);
					padding: 0.1rem 0.4rem;
					font-weight: bold;
				}
				display: flex;
				justify-content: space-start;
				width: 100%;
				div:first-child {
					width: 6rem;
				}
			`}
		>
			<div>Impact&nbsp;</div>
			{noFormula ? (
				'🤷'
			) : disabled ? (
				'Non applicable'
			) : (
				<div>
					<strong>
						-&nbsp;{value} {unit}
					</strong>{' '}
					{total && <span>&nbsp;{relativeValue}%</span>}
				</div>
			)}
		</div>
	)
}
