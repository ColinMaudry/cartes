export default ({
	setLocalSearch,
	localSearch,
	onInputChange,
	state,
	stepIndex,
}) => (
	<label
		css={`
			text-align: right;
			margin: 0 0 auto auto;
			display: block;
			width: 9rem;
			margin-top: 0.2rem;
			background: var(--darkerColor);
			color: white;
			padding: 0rem 0.6rem 0rem;
			border-radius: 0.3rem;
			> span {
				margin-left: 0.4rem;
			}
		`}
	>
		<input
			type="checkbox"
			defaultChecked={localSearch}
			onClick={() => {
				setLocalSearch(!localSearch)
				onInputChange(stepIndex, !localSearch)(state.slice(-1)[0].inputValue)
			}}
		/>
		<span>Rechercher ici</span>
	</label>
)
