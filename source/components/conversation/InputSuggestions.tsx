import { ASTNode } from 'publicodes'
import { toPairs } from 'ramda'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Emoji from '../Emoji'

type InputSuggestionsProps = {
	suggestions?: Record<string, ASTNode>
	onFirstClick: (val: ASTNode) => void
	onSecondClick?: (val: ASTNode) => void
}

export default function InputSuggestions({
	suggestions = {},
	onSecondClick = (x) => x,
	onFirstClick,
}: InputSuggestionsProps) {
	const [suggestion, setSuggestion] = useState<ASTNode>()
	const { t, i18n } = useTranslation()

	return (
		<div
			className="ui__ notice"
			css={`
				display: flex;
				align-items: baseline;
				justify-content: flex-end;
				margin-bottom: 0.4rem;
				flew-wrap: wrap;
			`}
		>
			{toPairs(suggestions).map(([text, value]: [string, ASTNode]) => {
				return (
					<button
						className="ui__ link-button"
						key={text}
						css={`
							margin: 0.2rem 0.4rem !important;
							:first-child {
								margin-left: 0rem !important;
							}
						`}
						onClick={() => {
							onFirstClick(value)
							if (suggestion !== value) setSuggestion(value)
							else onSecondClick && onSecondClick(value)
						}}
						title={t('cliquez pour insérer cette suggestion')}
					>
						<Emoji e={text} hasText />
					</button>
				)
			})}
		</div>
	)
}
