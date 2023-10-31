import AvionExplanation from '../AvionExplanation'
import Emoji from '../Emoji'

const ShareButton = dynamic(() => import('Components/ShareButton'), {
	ssr: false,
})

import { title } from '../utils/publicodesUtils'
import dynamic from 'next/dynamic'

const SimulationEnding = ({ rule, engine, objectives }) => {
	const avion = objectives[0] === 'transport . avion . impact'
	return (
		<div style={{ textAlign: 'center' }}>
			<>
				<h3>
					<Emoji e={'🌟'} /> Terminé !
				</h3>
				<p>Vous avez complété votre simulation. Partagez-là !</p>
				<ShareButton {...{ text: title(rule) }} />
				{avion && (
					<AvionExplanation
						engine={engine}
						description={rule.rawNode.description}
					/>
				)}
			</>
		</div>
	)
}

export default SimulationEnding
