import SettingsService from '../nav/drawers/settings.service.js'
import fr from './fr.js'
import en from './en.js'

function language(value) {
    return structuredClone({fr, en}[value])
}

function missingProxy(_path) {
  return new Proxy({}, {
    get(target, prop) {
      if (prop === Symbol.toPrimitive || prop == 'toString' || prop == Symbol.toStringTag) {
        return () => _path
      }

      if( prop == '__v_raw') {
        return _path
      }

      console.log({missing: true, ...arguments})

      return missingProxy(`${_path}.${prop}`)
    }
  })
}

function nestedProxy(source, _path) {
  return new Proxy(source, {
    get(target, prop, receiver) {

      console.log({ nested: true, target, prop, receiver })
      const path = _path ? `${_path}.${prop}` : prop

      if (prop in target) {
        const value = Reflect.get(target, prop)

        if (value instanceof Object) {
          return nestedProxy(value, path)
        } else {
          console.log({ value })
          return value
        }
      } else {
        return missingProxy(path)
      }
    }
  })
}

class Translations {
  constructor(lang) {
    this.setLanguage(lang)

    return nestedProxy(this)
  }

  setLanguage(lang) {
    const current = language(lang)

    Object.assign(this, current)

    Object.keys(current).forEach( key => {
      if (current[key] instanceof Object) {
        this[key] = nestedProxy(current[key])
      } else {
        this[key] = current[key]
      }
    })
  }

}

Vue.watch(
  () => SettingsService.ui.language,
  (lang) => {
    translations.setLanguage(lang)
  }
)

const translations = new Translations(SettingsService.ui.language)

export default Vue.reactive(translations)
