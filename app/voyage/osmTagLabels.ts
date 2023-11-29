import rawData from '@openstreetmap/id-tagging-schema/dist/translations/fr.json'

const { presets, categories, fields } = rawData.fr.presets

export const getTagLabels = (key, value) => {
	const fullPreset = presets[key + '/' + value]
	if (fullPreset) return [fullPreset.name]

	const field = fields[key]

	if (!field) return [key, translateBasics(value)]

	const values = value.split(';'),
		translatedValues = values.map(
			(v) => field.options?.[v] || translateBasics(v)
		)
	return [field.label, translatedValues.join(' - ')]
}

const translateBasics = (value) => {
	const found = { yes: 'oui', no: 'non' }[value]
	return found || value
}