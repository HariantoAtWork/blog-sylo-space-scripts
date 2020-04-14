;(() => {
	// Creates element #disqus_thread and load Disqus script
	let d = document,
		el = d.querySelector('#site-main .post-full')

	if (el) {
		const disqusThread = d.createElement('footer'),
			s = d.createElement('script')
		disqusThread.setAttribute('id', 'disqus_thread')
		el.appendChild(disqusThread)
		s.src = '//hariantoatworkblog.disqus.com/embed.js'
		s.setAttribute('data-timestamp', +new Date())
		disqusThread && (d.head || d.body).appendChild(s)
	}
})()
