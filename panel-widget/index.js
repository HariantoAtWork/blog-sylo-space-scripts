import wrap from 'https://cdn.jsdelivr.net/npm/@vue/web-component-wrapper@1.2.0/dist/vue-wc-wrapper.min.js'
;(() => {
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
		prependStyle = (el, css) => {
			const style = d.createElement('style')
			style.innerHTML = css
			el.prepend(style)
		},
		prependLink = (el, href) => {
			const link = d.createElement('link')
			link.rel = 'stylesheet'
			link.href = href
			el.prepend(link)
		}

	const projectPath = '/content/images/files/js/panel-widget/'
	const templates = [
		`${projectPath}panel-widget.less`,
		`${projectPath}panel-widget--app-tpl.html`,
		`${projectPath}whatsapp-livechat--main-tpl.html`
	]

	loadTemplates(templates)
		.then(values => {
			const [appStyle, ...rest] = values
			return less.render(appStyle).then(({ css }) => [css, ...rest])
		})
		.then(values => {
			const [appStyle, appTpl, mainTpl] = values

			const vClickOutside = () => {
				return {
					bind(el, binding, vnode) {
						el.event = event => {
							!Array.from(event.path).includes(el) && binding.value()
						}
						d.body.addEventListener('click', el.event)
					},
					unbind(el, binding, vnode) {
						d.body.removeEventListener('click', el.event)
					}
				}
			}

			const MainPanel = {
				name: 'MainPanel',
				template: mainTpl
			}

			const App = Vue.extend({
				name: 'PanelWidget',
				template: appTpl,
				directives: {
					'click-outside': vClickOutside()
				},
				components: {
					MainPanel
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
					prependLink(
						this.$el,
						'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css'
					)
				}
			})

			// const PanelWidget = new App({
			// 	el: 'panel-widget'
			// })

			customElements.define('panel-widget', wrap(Vue, App))
		})
})()
