const KEY = 'history'

const loadedHistory = JSON.parse(localStorage.getItem(KEY) ?? '[]')

export default {
  requests: Vue.reactive(loadedHistory),
}
