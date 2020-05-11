;(() => {
	if (history.scrollRestoration) {
		history.scrollRestoration = 'manual'
	}
	const d = document,
		loadTemplate = url =>
			fetch(url)
				.then(response => response.text())
				.catch(console.error.bind(console, 'FAIL: loadTemplate')),
		loadTemplates = templates => {
			const promises = templates => {
				const list = []
				templates.forEach(i => list.push(loadTemplate(i)))
				return list
			}

			return Promise.all(promises(templates)).catch(
				console.error.bind(console, 'FAIL: Promise.all')
			)
		},
		projectFolder = '/content/images/files/js/pageindex/',
		templates = [
			`${projectFolder}pageindex.less`,
			`${projectFolder}pageindex--app-tpl.html`,
			`${projectFolder}pageindex--index-tpl.html`
		],
		prependStyle = (el, css) => {
			const style = d.createElement('style')
			style.innerHTML = css
			el.prepend(style)
		}

	loadTemplates(templates)
		.then(values => {
			const [appStyle, ...rest] = values
			return less.render(appStyle).then(({ css }) => [css, ...rest])
		})
		.then(values => {
			const [appStyle, appTpl, indexTpl] = values

			const rootEl = () => {
					const t = d.documentElement || d.body.parentNode
					return t && typeof t.scrollTop == 'number' ? t : d.body
				},
				pushState = ({ scrollTop, header }) => {
					const pageIndex = {
						scrollTop: scrollTop || rootEl().scrollTop,
						header
					}
					if (header) {
						history.pushState(
							{ pageIndex },
							d.title,
							window.location.pathname + '#' + header
						)
					} else {
						history.pushState({ pageIndex }, d.title)
					}
				},
				onPopstate = event => {
					const { state } = event
					state &&
						state.pageIndex &&
						(rootEl().scrollTop = state.pageIndex.scrollTop)
				},
				// Vue Directive: v-click-outside
				vClickOutside = () => {
					return {
						bind(el, binding, vnode) {
							el.event = event =>
								!Array.from(event.path).includes(el) && binding.value()

							d.body.addEventListener('click', el.event)
						},
						unbind(el, binding, vnode) {
							d.body.removeEventListener('click', el.event)
						}
					}
				}

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
				name: 'PageIndex',
				template: appTpl,
				directives: {
					'click-outside': vClickOutside()
				},
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
					},
					onClose() {
						this.show = false
					}
				},
				mounted() {
					prependStyle(this.$el, appStyle)
					const hash = window.location.hash
					window.addEventListener('popstate', onPopstate)
					history.replaceState(
						{
							pageIndex: {
								scrollTop: rootEl().scrollTop,
								...(hash && {
									header: hash.substring(1)
								})
							}
						},
						d.title,
						window.location.href
					)

					if (hash) {
						rootEl().scrollTop = Index.methods.getOffsetScrollTop(
							d.getElementById(hash.substring(1))
						)
					}
				}
			})

			const PageIndex = new App({
				propsData: {
					element: '.post-full .post-content'
				}
			})

			PageIndex.$mount('#page-index')
		})
})()
