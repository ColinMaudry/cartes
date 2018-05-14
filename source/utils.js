export let capitalise0 = name => name[0].toUpperCase() + name.slice(1)

export let getUrl = () => window.location.href.toString()

export let parseDataAttributes = value =>
	value === 'undefined'
		? undefined
		: value === null
			? null
			: !isNaN(value)
				? +value
				: /* value is a normal string */
				  value

export let getIframeOption = optionName => {
	let url = getUrl(),
		hasOption = url.includes(optionName + '=')
	return parseDataAttributes(
		hasOption && url.split(optionName + '=')[1].split('&')[0]
	)
}
