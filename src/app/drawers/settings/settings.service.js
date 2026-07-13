import hotkeys from '../../hotkeys/bindings.js'

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
    previewAllowScripts: false,
  },

  ui: {
    alwaysShowTabs: false,
    theme: 'system',
    language: 'fr',
    drawerWidth: 256,
  },

  hotkeys,
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
