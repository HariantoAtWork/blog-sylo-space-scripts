;(() => {
	const d = document,
		el = d.currentScript,
		{ href } = location,
		newEl = d.createElement('div')

	newEl.classList.add('fb-like')
	Object.entries({
		'data-href': href.split(':').pop(),
		'data-layout': 'button_count',
		'data-action': 'like',
		'data-size': 'small',
		'data-share': true
	}).forEach(([name, value]) => newEl.setAttribute(name, value))
	el.parentNode.replaceChild(newEl, el)
})()
