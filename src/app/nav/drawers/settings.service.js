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
    'nav.hotkeys': 'meta+/',
    'nav.history': 'meta+h',
    'nav.settings': 'meta+.',

    'tabs.new': 'meta+t',
    'tabs.close': 'meta+w',
    'tabs.next': 'meta+tab',
    'tabs.previous': 'meta+shift+tab',

    'request.url': 'meta+l',
    'request.method': 'meta+enter',
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
