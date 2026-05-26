import t from '../translate/translate.service.js'

import SettingsService from '../drawers/settings/settings.service.js'

const defaultTab = {
  id: 'default',
  title: t.tabs.defaultRequestName,
}

let count = 0

const tabs = Vue.reactive([ defaultTab ])
const current = Vue.ref(defaultTab.id)

export default {
  current: Vue.readonly(current),

  tabs: Vue.readonly(tabs),

  new() {
    count = count + Number(tabs.length > 1 || count > 0)
    const id = crypto.randomUUID()

    let titleParts = [t.tabs.newRequest]

    if (count > 0) {
      titleParts.push(count)
    }

    tabs.unshift({
      id,
      title: titleParts.join(' '),
    })

    current.value = id
  },

  get(id) {
    return tabs.find( t => t.id == id )
  },

  select(id) {
    if (id) {
      current.value = id
    }
  },

  rename(id, title) {
    const tab = this.get(id)
    tab.title = title
  },

  remove(id) {
    if (tabs.length == 1) {
      return
    }

    const index = tabs.findIndex( t => t.id == id )
    tabs.splice(index, 1)

    if (id == current.value) {
      const substituteIndex = Math.min(Math.max(index, 0), tabs.length - 1)
      current.value = tabs[substituteIndex].id
    }
  },

  step(direction) {
    const currentIndex = tabs.findIndex( t => t.id == current.value )
    const length = tabs.length
    const destinationIndex = Math.max(currentIndex + direction, 0) % length

    current.value = tabs[destinationIndex].id
  },

  goNext() {
    this.step(1)
  },

  goPrevious() {
    this.step(-1)
  },
}
