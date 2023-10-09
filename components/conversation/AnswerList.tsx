'use client'
import Emoji from 'Components/Emoji'
import { parentName, safeGetRule } from 'Components/utils/publicodesUtils'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { motion } from 'framer-motion'
import { DottedName } from 'modele-social'
import { EvaluatedNode, formatValue } from 'publicodes'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getFoldedSteps, getSituation } from '../utils/simulationUtils'
import './AnswerList.css'

export default function AnswerList({ searchParams, objectives, engine }) {
	console.log('TATA', objectives)
	const dispatch = useDispatch()
	const rules = engine.getParsedRules()
	const validatedSituation = getSituation(searchParams, rules)
	const foldedQuestionNames = getFoldedSteps(searchParams, rules)
	const answeredQuestionNames = Object.keys(validatedSituation)
	const foldedQuestions = foldedQuestionNames
		.map((dottedName) => {
			const rule = safeGetRule(engine, dottedName)

			const evaluated = rule && engine.evaluate(rule)
			return evaluated
		})
		.filter(Boolean)
	const foldedStepsToDisplay = foldedQuestions
		.map((node) => ({
			...node,
			passedQuestion:
				answeredQuestionNames.find(
					(dottedName) => node.dottedName === dottedName
				) == null,
		}))
		.filter((node) => !JSON.stringify(node).includes('"injecté":"oui"')) // Very strange, should just be rule.rawNode, instead we've got to search for a deeply nested final value, hence the stringified search
	// Engine evaluated multiple times ? TODO

	const nextSteps = useNextQuestions(objectives, engine, searchParams).map(
		(dottedName) => engine.evaluate(engine.getRule(dottedName))
	)

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!(e.ctrlKey && e.key === 'c')) return
			console.log('VOILA VOTRE SITUATION')
			console.log(
				JSON.stringify({
					data: { validatedSituation, foldedSteps: foldedQuestionNames },
				})
			)
			/* MARCHE PAS : 
			console.log(
				Object.fromEntries(
					Object.entries(situation).map(([key, value]) => [
						key,
						serializeEvaluation(value),
					])
				)
			)
			*/
			e.preventDefault()
			return false
		}
		window.addEventListener('keydown', handleKeyDown)
		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [validatedSituation])

	const answeredQuestionsLength = foldedStepsToDisplay.length,
		nextQuestionsLength = nextSteps.length

	return (
		<div className="answer-list">
			{!!foldedStepsToDisplay.length && (
				<details
					css={`
						font-size: 120%;
						margin-bottom: 0.2rem;
						display: flex;
						align-items: center;

						img {
							margin-right: 0.2rem;
							vertical-align: bottom;
							width: 2rem;
							height: auto;
						}
						button {
							color: white;
						}
						margin: 1rem;
						cursor: pointer;
						summary {
							display: flex;
							justify-content: center;
							align-items: center;
							> * {
								margin: 0 0.2rem;
							}
						}
						> div > button {
							margin: 0 0 0 auto;
							display: block;
						}
					`}
				>
					<summary>
						<Emoji e="📋 " />
						<span>
							{answeredQuestionsLength} réponses
							{nextQuestionsLength > 0
								? `, ${nextQuestionsLength} restantes`
								: ''}
						</span>
					</summary>
					<div>
						<button
							onClick={() => dispatch({ type: 'RESET_SIMULATION' })}
							title="Effacer mes réponses"
						>
							<Emoji e="♻️" />
							Effacer
						</button>

						<StepsTable {...{ rules: foldedStepsToDisplay }} />
					</div>
				</details>
			)}
			{false && !!nextSteps.length && (
				<div className="ui__ card">
					<h2>
						<Emoji e="🔮 " />
						Prochaines questions
					</h2>
					<CategoryTable {...{ steps: nextSteps, categories }} />
				</div>
			)}
		</div>
	)
}

function StepsTable({
	rules,
}: {
	rules: Array<EvaluatedNode & { nodeKind: 'rule'; dottedName: DottedName }>
}) {
	return (
		<table
			css={`
				border: 2px solid var(--darkerColor2);
			`}
		>
			<tbody>
				{rules.map((rule) => (
					<Answer
						{...{
							rule,
							validatedSituation,
							objectives,
						}}
					/>
				))}
			</tbody>
		</table>
	)
}

const Answer = ({ rule, validatedSituation, objectives }) => {
	// Shameless exception, sometimes you've got to do things dirty
	if (
		[
			'transport . avion . départ',
			'transport . avion . arrivée',

			'transport . ferry . départ',
			'transport . ferry . arrivée',

			'trajet voiture . départ',
			'trajet voiture . arrivée',
		].includes(rule.dottedName)
	)
		return null

	const path = parentName(rule.dottedName, ' · ', 1)
	const uselessPrefix = simulationDottedName.includes(path)
	const language = 'fr'

	const trimSituationString = (el) => el && el.split("'")[1]
	if (rule.dottedName === 'transport . avion . distance de vol aller') {
		return (
			<AnswerComponent
				{...{
					dottedName: rule.dottedName,
					NameComponent: <div>Votre vol</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								validatedSituation['transport . avion . départ']
							)} - ${trimSituationString(
								validatedSituation['transport . avion . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
				}}
			/>
		)
	}
	if (
		rule.dottedName === 'transport . ferry . distance aller . orthodromique'
	) {
		return (
			<AnswerComponent
				{...{
					dottedName: rule.dottedName,
					NameComponent: <div>Votre traversée</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								validatedSituation['transport . ferry . départ']
							)} - ${trimSituationString(
								validatedSituation['transport . ferry . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
				}}
			/>
		)
	}
	if (rule.dottedName === 'trajet voiture . distance') {
		return (
			<AnswerComponent
				{...{
					dottedName: rule.dottedName,
					NameComponent: <div>Votre trajet</div>,
					ValueComponent: (
						<span className="answerContent">
							{`${trimSituationString(
								validatedSituation['trajet voiture . départ']
							)} - ${trimSituationString(
								validatedSituation['trajet voiture . arrivée']
							)} (${formatValue(rule, { language })})`}
						</span>
					),
				}}
			/>
		)
	}

	const NameComponent = (
		<div>
			{path && !uselessPrefix && (
				<div>
					<small>{path}</small>
				</div>
			)}
			<div css="font-size: 110%">{rule.title}</div>
		</div>
	)

	const ValueComponent = (
		<span
			className="answerContent"
			css={`
				${rule.passedQuestion ? 'opacity: .5' : ''}
			`}
		>
			{formatValue(rule, { language })}
			{rule.passedQuestion && (
				<Emoji e={' 🤷🏻'} alt="Je ne sais pas : réponse par défaut" />
			)}
		</span>
	)
	return (
		<AnswerComponent
			{...{ dottedName: rule.dottedName, NameComponent, ValueComponent }}
		/>
	)
}

const AnswerComponent = ({ dottedName, NameComponent, ValueComponent }) => {
	const dispatch = useDispatch()
	return (
		<motion.tr
			initial={{ opacity: 0, y: -50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.3 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
			key={dottedName}
			css={`
				background: var(--darkestColor);
			`}
		>
			<td>{NameComponent}</td>
			<td>
				<button
					className="answer"
					css={`
						display: inline-block;
						padding: 0.6rem;
						color: inherit;
						font-size: inherit;
						width: 100%;
						text-align: end;
						font-weight: 500;
						> span {
							text-decoration: underline;
							text-decoration-style: dashed;
							text-underline-offset: 4px;
							padding: 0.05em 0em;
							display: inline-block;
						}
					`}
					onClick={() => {
						dispatch({
							type: 'STEP_ACTION',
							name: 'unfold',
							step: dottedName,
						})
					}}
				>
					{ValueComponent}
				</button>
			</td>
		</motion.tr>
	)
}
