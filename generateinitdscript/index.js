import { saveAs } from 'file-saver/src/FileSaver'
;(target => {
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
		projectPath = '/content/images/files/js/generateinitdscript/',
		templates = [
			`${projectPath}generateinitdscript.less`,
			`${projectPath}generateinitdscript--app-tpl.html`,
			`${projectPath}generateinitdscript--initd-tpl.html`
		]

	loadTemplates(templates)
		.then(values => {
			const [appStyle, ...rest] = values
			return less.render(appStyle).then(({ css }) => [css, ...rest])
		})
		.then(values => {
			const [appStyle, appTpl, initdTpl] = values

			// Component: Initd
			const Initd = {
				name: 'Initd',
				template: initdTpl,
				props: {
					formData: {
						type: Object,
						default: () => ({})
					}
				},
				computed: {
					outputData() {
						let output = {}
						for (let [key, value] of formData) {
							output[key] = value
						}

						return output
					}
				},
				methods: {
					validate(prop) {
						return (prop['value'] !== '' && prop.value) || prop.defaultValue
					}
				}
			}

			// Root Component: App
			const App = new Vue({
				components: { Initd },
				name: 'InitDScriptGenerator',
				template: appTpl,
				data: () => ({
					formData: {
						initinfoProvides: {
							value: '',
							defaultValue: 'my-node-app',
							placeholder: 'INIT INFO: application-name-camel-case'
						},
						initinfoShortdescription: {
							value: '',
							defaultValue: 'My Node App.',
							placeholder: 'INIT INFO: Short Description'
						},
						initinfoDescription: {
							value: '',
							defaultValue: 'My app handles interesting computation in life.',
							placeholder: 'INIT INFO: Description'
						},
						chkconfiginfoDescription: {
							value: '',
							defaultValue: 'My application',
							placeholder: 'CHKCONFIG INFO: Description'
						},
						applicationName: {
							value: '',
							defaultValue: 'My Application',
							placeholder: 'An application name to display in echo text.'
						},
						applicationSourceDirectory: {
							value: '',
							defaultValue: '/var/node-apps/my-node-app',
							placeholder: 'Source Directory where node application is.'
						},
						applicationMainJavascript: {
							value: '',
							defaultValue: 'index.js',
							placeholder:
								'The application startup Javascript file path relative to APPLICATION_SOURCE_DIR.: index.js'
						},
						applicationPortExpose: {
							value: '',
							defaultValue: '3000',
							placeholder: 'PORT: 3000'
						},
						nvmNodeVersion: {
							value: '',
							defaultValue: 'v0.10.46',
							placeholder: '(NVM) Node version example: v0.10.46'
						},
						nodeEnv: {
							value: '',
							defaultValue: 'production',
							placeholder: 'NODE_ENV: production'
						},
						foreverId: {
							value: '',
							defaultValue: 'mynodeapp',
							placeholder:
								'foreverID: Process ID easier to identify and shutdown: '
						},
						varRunPidfile: {
							value: '',
							defaultValue: '/var/run/mynodeapp.pid',
							placeholder: 'Process ID file path.'
						},
						varLogApplicationLog: {
							value: '',
							defaultValue: '/var/log/mynodeapp.log',
							placeholder: 'Log file path.'
						},
						exportedFile: {
							value: '',
							defaultValue: 'mynodeapp-d',
							placeholder: 'Exported file name.'
						}
					}
				}),
				methods: {
					validate(prop) {
						return (prop['value'] !== '' && prop.value) || prop.defaultValue
					},
					exportFile(ref) {
						const file = this.validate(this.formData.exportedFile)
						const output = this.$refs[ref].$el.innerHTML
						const blob = new Blob([output], {
							type: 'text/plaincharset=utf-8'
						})
						saveAs(blob, file)
						console.log(output)
					}
				},
				// LifeCycle Hooks
				mounted() {
					prependStyle(this.$el, appStyle)
				}
			})
			App.$mount(target)
		})
})('#generateinitdscript-app')
