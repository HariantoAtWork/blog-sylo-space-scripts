//import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.min.js'
import wrap from 'https://cdn.jsdelivr.net/npm/@vue/web-component-wrapper@1.2.0/dist/vue-wc-wrapper.min.js'
;(() => {
	const d = document,
		div = d.createElement('div'),
		innerHTML = id => d.getElementById(id).innerHTML,
		appTplCompiled = Vue.compile(innerHTML('quickstart-app--app-tpl'))

	const App = {
		data: () => ({
			hello: 'DERP',
			show: false
		}),

		// render(h, context) {
		// 	// const that = this
		// 	// console.log({ that })
		// 	return h('div', [h(appTplCompiled)])
		// }

		render(h, context) {
			console.log({ info: this })
			return h('div', {
				domProps: {
					innerHTML:
						`<style>${innerHTML('workinprogress-less')}</style>` +
						innerHTML('quickstart-app--app-tpl')
				}
			})
		}

		// render: appTplCompiled.render,
		// staticRenderFns: appTplCompiled.staticRenderFns
	}

	console.log({ appTplCompiled })

	// Define the new element
	customElements.define('work-in-progress', wrap(Vue, App))
})()
