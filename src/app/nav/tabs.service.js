import t from '../translate/translate.service.js'

import SettingsService from '../nav/drawers/settings.service.js'

const defaultTab = {
  id: 'default',
  title: t.tabs.defaultRequestName,
}

let count = 0

export default {
  current: Vue.ref(defaultTab.id),

  tabs: Vue.reactive([
    defaultTab,
  ]),

  new() {
    count = count + Number(this.tabs.length > 1 || count > 0)
    const id = crypto.randomUUID()

    let titleParts = [t.tabs.newRequest]

    if (count > 0) {
      titleParts.push(count)
    }

    this.tabs.unshift({
      id,
      title: titleParts.join(' '),
    })

    this.current.value = id
  },

  select(id) {
    if (id) {
      this.current.value = id
    }
  },

  get(id) {
    return this.tabs.find( t => t.id == id )
  },

  rename(id, title) {
    const tab = this.get(id)
    tab.title = title
  },

  remove(id) {
    const index = this.tabs.findIndex( t => t.id == id )
    this.tabs.splice(index, 1)

    if (id == this.current.value) {
      const substituteIndex = Math.min(Math.max(index, 0), this.tabs.length - 1)
      this.current.value = this.tabs[substituteIndex].id
    }
  },

  step(direction) {
    const currentIndex = this.tabs.findIndex( t => t.id == this.current.value )
    const length = this.tabs.length
    const destinationIndex = Math.max(currentIndex + direction, 0) % length

    this.current.value = this.tabs[destinationIndex].id
  },

  goNext() {
    this.step(1)
  },

  goPrevious() {
    this.step(-1)
  },
}
