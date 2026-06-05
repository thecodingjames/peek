import SettingsService from '../drawers/settings/settings.service.js'

class HotkeysService {

  #callbacks = { }

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

    const remove = Vuetify.useHotkey(hotkey, callback, { preventDefault: true, inputs: true })

    this.#callbacks[name] = {
      hotkey,
      callback,
      remove,
    }
  }

  update(name, binding) {
    SettingsService.hotkeys[name] = binding

    const previous = this.#callbacks[name]

    if (previous) {
      // prevent updating hotkey never registered
      previous.remove()
      this.set(name, previous.callback)
    }
  }

  remove(name) {
    this.#callbacks[name].remove()
  }

  binding(name) {
    return SettingsService.hotkeys[name]
  }

}

const service = new HotkeysService()

export default service
