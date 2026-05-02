import App from './app/app.js'
import { routes } from './app/routes.js'

const app = Vue.createApp(App)
app.use(Vuetify.createVuetify())
app.use(VueRouter.createRouter({ 
  history: VueRouter.createMemoryHistory(),
  routes,
}))

app.mount('#app')
