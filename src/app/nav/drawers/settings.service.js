const KEY = 'settings'

const defaultSettings = {
  http: {
    followRedirect: true,
  },

  ui: {
    theme: 'system',
    language: 'fr',
  },

  hotkeys: {
    hotkeysDialog: 'cmd+/',
    drawersHistory: 'cmd+h',
    drawersSettings: 'cmd+.',
  },

}

const loadedSettings = JSON.parse(localStorage.getItem(KEY))

const mergedSettings = Object.assign(defaultSettings, loadedSettings)

const settings = Vue.reactive(mergedSettings)

Vue.watch(
  settings,
  (value) => {
    localStorage.setItem(KEY, JSON.stringify(value))
  }
)

export default settings
