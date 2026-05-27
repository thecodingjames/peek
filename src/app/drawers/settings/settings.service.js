const KEY = 'settings'

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }

  return target;
}

const defaultSettings = {

  http: {
    followRedirect: true,
  },

  ui: {
    alwaysShowTabs: false,
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

const mergedSettings = deepMerge(defaultSettings, loadedSettings)

const settings = Vue.reactive(mergedSettings)

Vue.watch(
  settings,
  (value) => {
    localStorage.setItem(KEY, JSON.stringify(value))
  }
)

export default settings
