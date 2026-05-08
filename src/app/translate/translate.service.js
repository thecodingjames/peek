import SettingsService from '../nav/drawers/settings.service.js'
import fr from './fr.js'
import en from './en.js'

function language(value) {
    return structuredClone({fr, en}[value])
}

const currentLanguage = language(SettingsService.ui.language)
const translations = Vue.reactive(currentLanguage)

Vue.watch(
  () => SettingsService.ui.language,
  (value) => {
    console.log(value)
    Object.assign(currentLanguage, language(value))
  }
)

export default Vue.readonly(translations)
