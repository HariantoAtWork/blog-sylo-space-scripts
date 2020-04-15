const loadScript = url =>
	fetch(url)
		.then(response => response.text())
		.then(text => eval(text))
		.catch(console.error.bind(console, 'FAIL: loadScript'))

const loadScripts = scripts => {
	const promises = scripts => {
		const list = []
		scripts.forEach(i => list.push(loadScript(i)))
		return list
	}

	return Promise.all(promises(scripts)).catch(
		console.error.bind(console, 'FAIL: Promise.all')
	)
}
