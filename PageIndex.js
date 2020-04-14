;(() => {
	class PageIndex extends HTMLElement {
		constructor() {
			// Always call super first in constructor
			super()

			const d = document,
				options = () => {
					const attr = {}
					for (let { name, value } of this.attributes) {
						attr[name] = value
					}
					return attr
				},
				rootEl = () => {
					const t = d.documentElement || d.body.parentNode
					return t && typeof t.scrollTop == 'number' ? t : d.body
				},
				setStyle = (el, style) => {
					for (let [key, value] of Object.entries(style)) {
						el.style[key] = value
					}
				},
				pushState = scrollTop => {
					const pageIndex = { scrollTop: scrollTop || rootEl().scrollTop }
					history.pushState({ pageIndex }, d.title)
				},
				getOffsetScrollTop = (el, relativeEl) =>
					el.getBoundingClientRect().top -
					(relativeEl || d.body).getBoundingClientRect().top -
					(options().offset
						? options().offset
						: d.querySelector('.site-header .outer')
						? d.querySelector('.site-header .outer').getBoundingClientRect()
								.height
						: 0)

			// Events
			const onDOMContentLoaded = event => {
				const { element } = options()
				if (!element) return
				this.classList.add('page-index')

				const headers = d
					.querySelector(element)
					.querySelectorAll('h1, h2, h3, h4, h5, h6')

				const ul = this.appendChild(d.createElement('ul'))
				ul.classList.add('page-index__list')
				Array.from(headers).forEach(el => {
					let li = ul.appendChild(d.createElement('li')),
						a = li.appendChild(d.createElement('a'))
					li.classList.add('page-index__list-item')
					if (el.id) a.href = `#${el.id}`
					a.innerHTML = el.innerHTML
					a.title = el.innerText
					a.classList.add(`page-index--${el.tagName}`)
					a.$el = el
				})

				ul.addEventListener('click', event => {
					event.preventDefault()
					const { target } = event
					console.log({ target, closest: target.closest('a') })
					const a = target.closest('a')
					pushState(getOffsetScrollTop(a.$el))
					rootEl().scrollTop = getOffsetScrollTop(a.$el)

					a.$el.classList.add('page-index--visited')
				})
			}
			const onPopstate = event => {
				const { state } = event
				state &&
					state.pageIndex &&
					(rootEl().scrollTop = state.pageIndex.scrollTop)
			}

			window.addEventListener('DOMContentLoaded', onDOMContentLoaded)
			window.addEventListener('popstate', onPopstate)

			// Init
			history.replaceState(
				{ pageIndex: { scrollTop: rootEl().scrollTop } },
				d.title
			)
		}
	}

	// Define the new element
	customElements.define('page-index', PageIndex)
})()
