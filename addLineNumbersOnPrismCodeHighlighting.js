;(() => {
	const d = document
	const onDOMContentLoaded = () => {
		// Add class .line-numbers to pre/code for Line Numbers
		const codeElememts = document.querySelectorAll(
			"[class*='language-']:not(.line-numbers)"
		)
		codeElememts.forEach((el, i) => el.classList.add('line-numbers'))
		if (Prism.plugins && Prism.plugins.autoloader)
			Prism.plugins.autoloader.languages_path =
				'//cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/components/'

		// Rerun Prism syntax highlighting on the current page
		Prism && Prism.highlightAll()
	}

	// Init
	if (
		d.readyState === 'complete' ||
		d.readyState === 'loaded' ||
		d.readyState === 'interactive'
	) {
		// document has at least been parsed
		onDOMContentLoaded()
	} else {
		window.addEventListener('DOMContentLoaded', onDOMContentLoaded)
	}
})()
