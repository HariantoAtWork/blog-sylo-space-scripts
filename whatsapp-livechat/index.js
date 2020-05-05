import wrap from 'https://cdn.jsdelivr.net/npm/@vue/web-component-wrapper@1.2.0/dist/vue-wc-wrapper.min.js'
;(() => {
	const loadTemplate = url =>
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
		d = document,
		prependStyle = (el, css) => {
			const style = d.createElement('style')
			style.innerHTML = css
			el.prepend(style)
		}

	const projectPath = '/content/images/files/js/whatsapp-livechat/'
	const templates = [
		`${projectPath}panel.less`,
		`${projectPath}panel--app-tpl.html`,
		`${projectPath}whatsapp-livechat--main-tpl.html`
	]

	loadTemplates(templates)
		.then(values => {
			const [appStyle, appTpl, mainTpl] = values
			return less.render(appStyle).then(({ css }) => [css, appTpl, mainTpl])
		})
		.then(values => {
			const [appStyle, appTpl, mainTpl] = values

			const vClickOutside = () => {
				const findParentElement = (el, target) => {
					while (el.parentNode) {
						el = el.parentNode
						if (el === target) return el
					}
					return null
				}
				return {
					bind(el, binding, vnode) {
						el.event = event => {
							if (!findParentElement(event.target, el)) binding.value()
						}
						d.body.addEventListener('click', el.event)
					},
					unbind(el, binding, vnode) {
						d.body.removeEventListener('click', el.event)
					}
				}
			}

			const Main = {
				name: 'Main',
				template: mainTpl
			}

			const App = new Vue({
				name: 'App',
				template: appTpl,
				directives: {
					'click-outside': vClickOutside()
				},
				components: {
					Main
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
				}
			})

			App.$mount('#whatsapp-livechat')
		})
})()
