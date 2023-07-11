import { iframeResize } from 'iframe-resizer'

const script = document.getElementById('futureco'),
	path = script?.getAttribute('path') || '',
	integratorUrl = encodeURIComponent(window.location.href.toString())

const couleur = script.dataset.couleur // not used yet

const srcURL = new URL(script.src)
const hostname = srcURL.hostname || 'futur.eco'

const src = `https://${hostname}/${path}?iframe&integratorUrl=${integratorUrl}`

const iframe = document.createElement('iframe')

const iframeAttributes = {
	src,
	style:
		'border: none; width: 100%; display: block; margin: 10px auto; min-height: 700px',
	allowfullscreen: true,
	webkitallowfullscreen: true,
	mozallowfullscreen: true,
}
for (var key in iframeAttributes) {
	iframe.setAttribute(key, iframeAttributes[key])
}
iframeResize({}, iframe)

const link = document.createElement('div')
link.innerHTML = `
<a href="https://futur.eco" target="_blank">Découvrir d'autres calculateurs d'impact carbone</a>
`
link.style.cssText = `
margin: .6rem auto 1rem;
text-align: center
`

script.parentNode.insertBefore(iframe, script)
script.parentNode.insertBefore(link, script)
