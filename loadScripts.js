const loadScripts = scripts => {
	const loadScript = url =>
		fetch(url)
			.then(response => response.text())
			.then(text => eval(text))
			.catch(console.error.bind(console, 'FAIL: loadScript'))

	const promises = scripts => {
		const list = []
		scripts.forEach(i => list.push(loadScript(i)))
		return list
	}

	return Promise.all(promises(scripts))
		.then(values => values.forEach(script => eval(script)))
		.catch(console.error.bind(console, 'FAIL: Promise.all'))
}
