import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import scenarios from './scenarios.yaml'
import { StoreContext } from './StoreContext'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import Emoji from 'Components/Emoji'

export default () => {
	const dispatch = useDispatch()
	const scenario = useSelector((state) => state.scenario)
	return (
		<section id="scenarios" className="ui__ container">
			<h1>Le crédit carbone personnel</h1>
			<p>
				Le jeu est simple : plus on émet de gaz à effet de serre, plus on se
				dirige vers une catastrophe climatique. Ces émissions se mesurent en{' '}
				<Link to="/à-propos">kg équivalent CO₂</Link>. Pour mieux comprendre
				l'impact de notre quotidien sur le climat,{' '}
				<strong>nous l'avons converti en temps</strong>.
			</p>
			<blockquote>
				<em>
					Si un voyage en avion en émet 500 kg et que la limite d'émission par
					personne et par an est de 6 tonnes, alors ce vol consomme un douzième
					de crédit annuel : en 2 heures de vol, j'ai grillé un mois de mon
					crédit carbone !
				</em>
			</blockquote>
			<h2 css="display: inline-block;background: var(--color); padding: .1rem .4rem; margin-right: .4rem;  color: white; margin-top: 1rem">
				Quel futur souhaitez vous ?
			</h2>
			<p>
				L'évolution du climat, et donc notre futur, est directement lié à la
				somme de toutes nos émissions de carbone individuelles. Voici trois
				scénarios, à vous de choisir ! &nbsp;{emoji('👇')}
			</p>
			<ul
				css={`
					list-style-type: none;
					display: flex;
					flex-wrap: nowrap;
					overflow-x: auto;
					-webkit-overflow-scrolling: touch; /* [4] */
					-ms-overflow-style: -ms-autohiding-scrollbar; /* [5] */
					width: 100%;
				`}
			>
				{Object.entries(scenarios).map(([nom, s]) => (
					<li
						className="ui__ card"
						css={`
							flex: 0 0 auto;
							width: 16vw;
							min-width: 16em;
							margin: 1em;
							border: 1px solid #eee;

							position: relative;
							padding-bottom: 6rem !important;

							h2 {
								margin-top: 0;
								font-size: 120%;
							}
							p {
								font-style: italic;
								font-size: 90%;
								line-height: 1.5rem;
							}

							button {
								visibility: hidden;
							}
							:hover button {
								visibility: visible;
							}

							${scenario === nom
								? `
								border: 4px solid var(--color)
								
							`
								: 'border: 4px solid white'}
						`}
					>
						<h2>
							<span>{emoji(s.icône)}</span>&nbsp;
							{s.titre}
						</h2>
						<p>{s['sous-titre']}</p>
						<div title="Réchauffement à la fin du siècle">
							<strong>
								{emoji('🌡️ ')} {s.réchauffement}
							</strong>
						</div>
						<div>
							{emoji('💰 ')}
							{s['crédit carbone par personne']}&nbsp;t de CO₂ / tête / an
						</div>
						<div css="margin-top: 1em; ">
							<p>{s.description}</p>
						</div>
						<div
							css={`
								position: absolute;
								bottom: 1rem;
								left: 50%;
								transform: translateX(-50%);
								img {
									font-size: 200%;
								}
							`}
						>
							{scenario === nom ? (
								<div>{emoji('✅')}</div>
							) : (
								<button
									className="ui__ button"
									onClick={() => {
										dispatch({ type: 'SET_SCENARIO', scenario: nom })
										setTimeout(() => window.history.go(-1), 1000)
									}}
								>
									Sélectionner
								</button>
							)}
						</div>
					</li>
				))}
			</ul>
			<div
				css={`
					display: none;
					margin: 0.6em auto;
					@media (max-width: 600px) {
						display: block;
						text-align: center;
					}
					font-size: 200%;
					filter: invert(1);
				`}
			>
				<Emoji extra="E105" alt="glisser horizontalement" black />
			</div>
			<p>
				Les conséquences de ces scénarios sont bien évidemment très compliquées
				à prévoir : ces descriptions sont indicatives et évolueront notamment
				lors du prochain rapport du{' '}
				<a href="https://fr.wikipedia.org/wiki/Groupe_d%27experts_intergouvernemental_sur_l%27%C3%A9volution_du_climat">
					GIEC
				</a>
				.
			</p>
			<p>
				Si vous êtes à l'aise en anglais, l'article{' '}
				<a href="http://nymag.com/intelligencer/2017/07/climate-change-earth-too-hot-for-humans.html">
					The Uninhabitable Earth
				</a>{' '}
				et le livre associé décrivent de façon très convainquante le pire des
				scénarios, et{' '}
				<a href="https://climatefeedback.org/evaluation/scientists-explain-what-new-york-magazine-article-on-the-uninhabitable-earth-gets-wrong-david-wallace-wells/">
					cet autre article
				</a>{' '}
				l remet en perspective de façon scientifiquement plus rigoureuse.
			</p>
		</section>
	)
}
