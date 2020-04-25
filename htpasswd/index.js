;(() => {
	const setLocalstorage = (prop, defaultValue) => {
		prop = prop.replace(/[\/!@#$%^&*]/g, '')
		return {
			get [prop]() {
				return JSON.parse(localStorage.getItem(prop)) || defaultValue || ''
			},
			set [prop](value) {
				localStorage.setItem(prop, JSON.stringify(value))
			}
		}
	}

	const model = {
		User: {
			username: '',
			password: ''
		}
	}

	const pathname = () => location.pathname.replace(/[\/!@#$%^&*]/g, '')

	const storage = setLocalstorage('formData', {
		users: [Object.create(model.User)],
		path: ''
	})

	const Panel = {
		template: '#quickstart-app--panel-tpl',
		props: ['title', 'value']
	}

	const App = new Vue({
		components: {
			Panel
		},
		template: '#quickstart-app--app-tpl',
		data: () => ({
			formData: {
				users: [],
				path: ''
			},
			htaccess: '',
			htpasswd: ''
		}),
		computed: {
			htaccessPanel() {
				const { path } = this.formData
				return `AuthUserFile ${path === '' ? '/' : path}.htpasswd
AuthGroupFile /dev/null
AuthName "Restricted Access"
AuthType Basic
<limit GET>
  require valid-user
</Limit>`
			}
		},
		watch: {
			formData: {
				handler: 'saveToStorage',
				deep: true
			},
			'formData.users': {
				handler: function (users) {
					console.log({ users })
					storage.formData = this.formData
				},
				deep: true
			}
		},
		methods: {
			addUser() {
				this.formData.users.push(Object.create(model.User))
			},
			removeItem(list, index) {
				return list.length > 1 && list.splice(index, 1)
			},
			saveToStorage() {
				storage.formData = this.formData
			},
			onGenerate(event) {}
		},
		// Life Cycle
		created() {
			const { formData } = storage
			console.log({ formData })
			this.formData = formData
		}
	})

	App.$mount('#quickstart-vue-app')
})()
