import { useState } from 'react'
import emoji from 'react-easy-emoji'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router'
import { Switch, Link, Route } from 'react-router-dom'
import {
	deletePreviousSimulation,
	resetSimulation,
} from '../../actions/actions'
import Emoji from '../../components/Emoji'
import ShareButton from '../../components/ShareButton'
import { useNextQuestions } from '../../components/utils/useNextQuestion'
import FuturecoMonochrome from '../../images/FuturecoMonochrome'
import { answeredQuestionsSelector } from '../../selectors/simulationSelectors'
import { colorScale } from './Simulateur'
import { GameDialog, LoudButton } from './UI'

const Eraser = ({}) => {
	const dispatch = useDispatch()
	const [erased, setErased] = useState(false)

	if (erased) return <Redirect to="/simulateur/bilan" />
	return (
		<button
			className="ui__ button simple small"
			css="width: auto !important"
			onClick={() => {
				dispatch(resetSimulation())
				dispatch(deletePreviousSimulation())
				setErased(true)
			}}
		>
			<Emoji e="🚮" /> Recommencer
		</button>
	)
}

export const Dialog = ({ children, noEraser = false, neutralColor }) => (
	<GameDialog>
		<div
			css={`
				display: flex;
				justify-content: center;
				margin-top: 0.6rem;
				svg {
					height: 4rem;
				}
			`}
		>
			<Link to="/">
				<FuturecoMonochrome
					color={neutralColor ? '#2988e6' : colorScale.slice(-1)[0]}
				/>
			</Link>
		</div>
		{children}

		{!noEraser && <Eraser />}
	</GameDialog>
)
export default () => {
	return (
		<Switch>
			<Route exact path="/fin" component={Perdu} />
			<Route exact path="/fin/perdu" component={Perdu} />
			<Route exact path="/fin/définition" component={Définition} />
			<Route exact path="/fin/suffisant" component={Suffisant} />
			<Route exact path="/fin/changer" component={Changer} />
			<Route exact path="/fin/chemin" component={Chemin} />
			<Route exact path="/fin/sources" component={Sources} />
			<Route exact path="/fin/action" component={Action} />
			<Route exact path="/fin/quand" component={Quand} />
			<Route exact path="/fin/danger" component={Danger} />
			<Route exact path="/fin/culpabilisation" component={Culpabilisation} />
			<Route exact path="/fin/pourquoi-trois" component={PourquoiTrois} />
			<Route exact path="/fin/claque" component={Claque} />
			<Route exact path="/fin/trajectoire" component={Trajectoire} />
			<Route exact path="/fin/ensemble" component={Ensemble} />
		</Switch>
	)
}

const Perdu = () => {
	const answeredQuestions = useSelector(answeredQuestionsSelector),
		answerCount = answeredQuestions.length,
		nextSteps = useNextQuestions(),
		nextStepsCount = nextSteps.length,
		totalCount = answerCount + nextStepsCount

	return (
		<Dialog>
			<h1>Perdu {emoji('🙁')}</h1>
			<p>
				<strong>Tu n'es pas écolo.</strong>
			</p>
			<p>Ton train de vie nous emène vers une planète dangereusement chaude.</p>
			<p>
				Il a suffi de <strong>{answerCount}</strong> réponses au test sur{' '}
				<strong>{totalCount}</strong> questions pour le savoir.
			</p>
			<LoudButton to="/fin/définition">
				Comment ça <br /> <em>pas écolo </em> ?
			</LoudButton>
		</Dialog>
	)
}

const Définition = () => (
	<Dialog>
		<h1>Être écolo, définition !</h1>
		<p>On ne peut pas être écolo si on défonce le climat. </p>
		<p>
			Votre médecin ne vous déclarera jamais en "bonne santé" si vos dents sont
			propres, votre tension normale, mais que vous avez{' '}
			<a href="https://kont.me/41-de-fièvre-mais-toutes-vos-dents">
				41° de fièvre
			</a>{' '}
			!{' '}
		</p>
		<p>
			Une empreinte climat personnelle de <strong>moins de 3 tonnes</strong> en
			est une <strong>condition nécessaire</strong>. Tu dépasses nettement cette
			limite.
		</p>

		<LoudButton to="/fin/suffisant">Et c'est suffisant ?</LoudButton>
	</Dialog>
)

const Suffisant = () => (
	<Dialog>
		<h1>Non, mais...</h1>
		<p>
			Le climat n'est certes qu'un critère à suivre dans la santé de notre
			biosphère {emoji('🌍')}.
		</p>
		<p>
			Mais l'effort de déconsommation nécessaire pour passer le "test climat"
			est colossal.
		</p>
		<p>
			Il se pourrait bien que beaucoup d'autres critères soient alors cochés
			d'office (biodiversité, épuisement des resssources, etc.).
		</p>
		<LoudButton to="/fin/claque">OK...</LoudButton>
	</Dialog>
)

const Chemin = () => (
	<Dialog>
		<h1>Comment prendre le bon chemin ?</h1>
		<p>
			La règle est simple : <br />
			<strong>- 10% d'empreinte par an.</strong>
		</p>
		<p>
			C'est simple : le français <Emoji e="🇫🇷" /> moyen a 10 tonnes d'empreinte.
		</p>

		<p>Expérience intéractive qui propose des pistes de changement</p>
		<LoudButton to="/fin/ensemble">Et ça suffit ?</LoudButton>
	</Dialog>
)
const Claque = () => (
	<Dialog>
		<h1>La claque</h1>
		<p>
			On ne t'avait jamais dit que c'était si compliqué ? Que ce test était{' '}
			<strong>très&nbsp;dur</strong> à passer ?{' '}
		</p>
		<p>
			Pipi sous la douche, ampoules basse conso, zéro déchet, électricité
			"verte", voiture électrique, compensation carbone... les petits gestes
			nous allègent la conscience et la technologie nous rassure.
		</p>
		<p>
			Mais le compte n'y est pas <strong>du tout</strong>.
		</p>

		<LoudButton to="/fin/trajectoire">Il est où alors ?</LoudButton>
	</Dialog>
)
const Trajectoire = () => (
	<Dialog>
		<h1>La trajectoire</h1>
		<p>
			Elle est limpide. Décroitre à 3 tonnes d'empreinte climat par personne.
		</p>
		<div
			css={`
				margin: 1rem 0;
				width: 100%;
				height: 20vh;
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				> div {
					height: 2.5rem;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: flex-start;
					padding: 0.6rem;
				}
				> div:first-child {
					background: ${colorScale[4]};
					width: 100%;
				}
				> div:last-child {
					background: ${colorScale[0]};
					width: 30%;
				}
			`}
		>
			<div>Le 🇫🇷 👤 moyen</div>
			<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<marker
						id="arrow"
						fill="white"
						viewBox="0 0 10 10"
						refX="5"
						refY="5"
						markerWidth="4"
						markerHeight="4"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 5 L 0 10 z" />
					</marker>
				</defs>

				<polyline
					points="-30,80 300,20"
					fill="none"
					stroke="white"
					strokeWidth="8px"
					marker-start="url(#arrow)"
				/>
			</svg>
			<div>L'écolo</div>
		</div>
		<p>
			<strong>Diviser par 3</strong> notre empreinte moyenne française de 10
			tonnes.
		</p>

		<LoudButton to="/fin/quand">À partir de quand ?</LoudButton>
	</Dialog>
)
const Quand = () => (
	<Dialog>
		<h1>C'est urgent</h1>
		<p>
			Oubliez les échéances en 2030, les trajectoires à 2050. C'est la plus
			belle <strong>procrastination</strong> de l'histoire humaine.
		</p>
		<p>
			Chaque année passée au-dessus de <strong>3 tonnes</strong> nous met tous
			en danger.
		</p>
		<a href="https://showyourstripes.info">
			<img
				css="width: 100%"
				src={require('Images/EUROPE-France--1899-2020-MF-bars.png').default}
			/>
		</a>
		<LoudButton to="/fin/danger">Lequel ?</LoudButton>
	</Dialog>
)
const Danger = () => (
	<Dialog>
		<h1>Quel danger ?</h1>
		<p>
			Perdre un environnement où peuvent vivre 7 milliards d'êtres humains et un
			billion de fois plus de vie.
		</p>
		<p>
			On parle de montée des eaux—Ré, Camargue et Bordeaux engloutis... parce
			qu'on sait modéliser ces catastrophes naturelles.
		</p>
		<p>
			Mais les vrais risques, imprévisibles, sont les <strong>famines</strong>,
			les <strong>guerres</strong> et les <strong>génocides</strong>.
		</p>
		<LoudButton to="/fin/culpabilisation">
			Vous voulez nous culpabiliser ?
		</LoudButton>
	</Dialog>
)
const Culpabilisation = () => (
	<Dialog>
		<h1>Nous sommes tous responsables</h1>
		<p>
			Nous avons tous le réflexe de remettre la responsabilité de nos choix sur
			d'autres : le grand méchant Total, l'État, la Chine, les riches, ou même
			"le système" qui écraserait les "gestes individuels".
		</p>
		<p>
			Dénoncer ce "système" et espérer trop patiemment qu'il change, c'est ce
			que l'on fait depuis 20 ans. Il est temps de{' '}
			<a href="https://kont.me/éloge-décroissance-individuelle">
				déconsommer et faire déconsommer
			</a>
			.
		</p>
		<p>
			Quand aux "riches", faites-leur passer ce test {emoji('😏')}. On dit que
			l'argent ne fait pas le bonheur, mais il défonce assurément le climat.
		</p>
		<LoudButton to="/fin/pourquoi-trois">Pourquoi 3 tonnes ?</LoudButton>
	</Dialog>
)

const PourquoiTrois = () => (
	<Dialog>
		<h1>Les maths</h1>
		<p>
			Normalement, l'objectif personnel d'équilibre est de{' '}
			<strong>moins de 2 tonnes</strong>.
		</p>

		<p>
			Mais nos services publics (l'éducation, les routes, l'armée etc.)
			représentent déjà environ 1 tonne. Pour ce test, on l'a mise de côté.
		</p>
		<p>
			2 <Emoji e="➕" /> 1 = 3
		</p>
		<LoudButton to="/fin/sources">Pourquoi vous croire ?</LoudButton>
	</Dialog>
)

const Sources = () => (
	<Dialog>
		<h1>Ça sort d'où ?</h1>
		<p>
			Le calcul utilisé ici est{' '}
			<a href="https://github.com/datagir/nosgestesclimat">
				<strong>complètement ouvert</strong>
			</a>
			, développé par l'ADEME, sans cesse amélioré.
		</p>
		<p>
			Et si on se trompait, que l'empreinte de la <Emoji e="🚗" /> était de 1 et
			pas de 1,234 ?
		</p>
		<p>
			<Emoji e="🎯" /> Peu importe à ce stade, on explose toutes et tous
			tellement les objectifs que l'
			<a href="https://www.assistancescolaire.com/eleve/6e/maths/reviser-une-notion/donner-un-ordre-de-grandeur-6mcp13">
				orde de grandeur
			</a>{' '}
			suffit.
		</p>

		<LoudButton to="/fin/action">Comment faire ?</LoudButton>
	</Dialog>
)

const Action = () => (
	<Dialog>
		<h1>Où est le GPS&nbsp;?</h1>
		<p>
			La 1ère étape vers la solution, c'est de{' '}
			<strong>comprendre l'ampleur du problème</strong>. C'était le but de ce
			test.
		</p>
		<p>
			De nombreux autres guides sont en train de sortir pour nous aider tous à
			réduire notre empreinte.
		</p>
		<p>Mais une chose avant tout ! </p>
		<LoudButton to="/fin/ensemble">Quoi encore ?</LoudButton>
	</Dialog>
)

const Ensemble = () => (
	<Dialog>
		<h1>En parler</h1>
		<p>
			Tout seul, on se recroqueville et on ne va pas loin. Ensemble, on change
			le monde.{' '}
		</p>
		<p>
			Il s'agit de notre planète, notre paix, notre bonheur,{' '}
			<strong>notre futur</strong> bordel !
		</p>
		<p>
			Tu as des amis, de la famille, l'internet ?{' '}
			<strong>On est tous dans la même merde.</strong>
		</p>
		<p>Partage-leur ce test ⬇️</p>
		<ShareButton
			text="Es-tu écolo ? Fais le test."
			url={'https://futur.eco'}
			title={'Es-tu écolo ? Le test.'}
			color={'white'}
		/>
	</Dialog>
)

const Changer = () => (
	<Dialog>
		<h1>Changer, maintenant</h1>
		<p>
			On n'a qu'une planète, pas de bouton{' '}
			<em>
				<Emoji e="♻️" />
				recommencer
			</em>
			, mais tout n'est pas cuit !
		</p>
		<p>
			Demain tu pourra ne pas prendre ta voiture <Emoji e="🚗" />.
		</p>
		<p>
			Dans deux semaines acheter un vélo <Emoji e="🚲" />.
		</p>

		<p>L'été prochain choisir d'autres destinations de vacances en train. </p>

		<p>L'année prochaine déménager, changer de boulot.</p>
		<LoudButton to="/fin/chemin">On s'y met ?</LoudButton>
	</Dialog>
)
