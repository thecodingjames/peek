import SettingsService from '../nav/drawers/settings.service.js'
import fr from './fr.js'
import en from './en.js'

function language(value) {
    return structuredClone({fr, en}[value])
}

function missingProxy(_path) {
  return new Proxy({}, {
    get(target, prop) {
      if (prop === Symbol.toPrimitive || prop == 'toString') {
        return () => _path
      }

      return missingProxy(`${_path}.${prop}`)
    }
  })
}

function nestedProxy(source, _path) {
  return new Proxy(source, {
    get(target, prop, receiver) {
      const path = _path ? `${_path}.${prop}` : prop

      if (prop in target) {
        const value = Reflect.get(target, prop)

        if (value instanceof Object) {
          return nestedProxy(value, path)
        } else {
          return value
        }
      } else {
        return missingProxy(path)
      }
    }
  })
}

const translations = Vue.reactive(language(SettingsService.ui.language))

Vue.watch(
  () => SettingsService.ui.language,
  (current) => {
    Object.assign(translations, language(current))
  }
)

export default nestedProxy(translations)
