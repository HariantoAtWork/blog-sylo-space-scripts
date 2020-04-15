;(() => {
	// Creates element: ghost-search
	let d = document
	if (!d.body) d.body = d.createElement('body')
	const ghostSearchDom = d.createElement('ghost-search')
	const attributes = {
		'url': location.origin,
		'ghost-key': 'd74579e93e65600e617d0b9823'
	}
	for (let [key, value] of Object.entries(attributes)) {
		const attr = d.createAttribute(key)
		attr.value = value
		ghostSearchDom.setAttributeNode(attr)
	}
	d.body.appendChild(ghostSearchDom)
})()
