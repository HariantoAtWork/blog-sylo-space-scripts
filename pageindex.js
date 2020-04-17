;(() => {
	if (history.scrollRestoration) {
		history.scrollRestoration = 'manual'
	}
	const loadTemplate = url =>
		fetch(url)
			.then(response => response.text())
			.catch(console.error.bind(console, 'FAIL: loadTemplate'))

	const loadTemplates = templates => {
		const promises = templates => {
			const list = []
			templates.forEach(i => list.push(loadTemplate(i)))
			return list
		}

		return Promise.all(promises(templates)).catch(
			console.error.bind(console, 'FAIL: Promise.all')
		)
	}

	const templates = [
		'/content/images/files/js/pageindex--app-tpl.html',
		'/content/images/files/js/pageindex--index-tpl.html'
	]

	loadTemplates(templates).then(values => {
		const [appTpl, indexTpl] = values

		const d = document,
			rootEl = () => {
				const t = d.documentElement || d.body.parentNode
				return t && typeof t.scrollTop == 'number' ? t : d.body
			},
			pushState = ({ scrollTop, header }) => {
				const pageIndex = { scrollTop: scrollTop || rootEl().scrollTop, header }
				history.pushState({ pageIndex }, d.title)
			},
			onPopstate = event => {
				const { state } = event
				state &&
					state.pageIndex &&
					(rootEl().scrollTop = state.pageIndex.scrollTop)
			}

		Vue.config.ignoredElements = ['page-index']
		// Component: Index
		const Index = {
			name: 'Index',
			template: indexTpl,
			props: {
				element: {
					type: String,
					required: true
				},
				offset: {
					type: Number
				}
			},
			data: () => ({
				items: []
			}),
			methods: {
				onPopstate(event) {
					const { state } = event
					if (!state.pageIndex) return
					const { scrollTop, header } = state.pageIndex
					rootEl().scrollTop =
						(header && this.getOffsetScrollTop(d.getElementById(header))) ||
						scrollTop
				},
				getOffsetScrollTop(el, relativeEl) {
					return (
						el.getBoundingClientRect().top -
						(relativeEl || d.body).getBoundingClientRect().top -
						(this.offset
							? this.offset
							: d.querySelector('.site-header .outer')
							? d.querySelector('.site-header .outer').getBoundingClientRect()
									.height
							: 0)
					)
				},
				gotoHeader(event, el) {
					event.preventDefault()
					pushState({
						scrollTop: this.getOffsetScrollTop(el),
						header: el.id
					})
					rootEl().scrollTop = this.getOffsetScrollTop(el)
				}
			},
			created() {
				const parent = d.querySelector(this.element)
				parent &&
					(this.items = parent.querySelectorAll('h1, h2, h3, h4, h5, h6'))
			}
		}
		// Component: App
		const App = Vue.extend({
			name: 'App',
			template: appTpl,
			components: {
				Index
			},
			props: {
				element: {
					type: String,
					required: true
				}
			},
			data: () => ({
				show: false,
				headers: []
			}),
			methods: {
				onTogglePanel() {
					this.show = !this.show
				}
			},
			mounted() {
				window.addEventListener('popstate', onPopstate)
				history.replaceState(
					{
						pageIndex: {
							scrollTop: rootEl().scrollTop,
							...(window.location.hash && {
								header: window.location.hash.substring(1)
							})
						}
					},
					d.title,
					window.location.href
				)
			}
		})

		const PageIndex = new App({
			propsData: {
				element: '.post-full .post-content'
			}
		})

		PageIndex.$mount('#target')
	})
})()
