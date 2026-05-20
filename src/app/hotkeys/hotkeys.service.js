import SettingsService from '../nav/drawers/settings.service.js'

class HotkeysService {

  constructor() {
    Object.keys(SettingsService.hotkeys).forEach(hotkey => {
      Vue.watch(
        () => SettingsService.hotkeys[hotkey],
        (hotkey) => {
          console.log({ hotkey })
        }
      )
    })
  }

  get all() {
    
    return Object.entries(SettingsService.hotkeys).reduce( (result, [id, binding]) => {
      const parts = id.split('.')

      const category = parts[0]
      const name = parts[1]

      result[category] = {
        ...result[category],
        [name]: binding
      }

      return result
    }, {})
  }

  set(name, callback) {
    const hotkey = SettingsService.hotkeys[name]

    Vuetify.useHotkey(hotkey, callback, { preventDefault: true })
  }

  on(name, callback) {
    this.set(name, callback)
  }

  off(name) {
    this.set(name, null)
  }

}

const service = new HotkeysService()

export default service
