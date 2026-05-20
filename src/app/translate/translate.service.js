import SettingsService from '../core/settings.service.js'
import fr from './fr.js'
import en from './en.js'

function language(value) {
    return structuredClone({fr, en}[value])
}

const translations = Vue.reactive(language(SettingsService.ui.language))

Vue.watch(
  () => SettingsService.ui.language,
  (value) => {
    Object.assign(translations, language(value))
  }
)

export default Vue.readonly(translations)
