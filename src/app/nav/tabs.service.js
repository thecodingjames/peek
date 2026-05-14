const defaultTab = {
  id: 'default',
  title: 'Request',
}

let count = 0

export default {
  current: Vue.ref(0),

  tabs: Vue.reactive([
    defaultTab,
  ]),

  new() {
    count = count + Number(this.tabs.length > 1 || count > 0)
    const id = crypto.randomUUID()

    this.tabs.unshift({
      id,
      title: ['New request', (count > 0 ? count: '')].join(' '),
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

  remove(id) {
    const index = this.tabs.findIndex( t => t.id == id )
    this.tabs.splice(index, 1)

    if (id == this.current.value) {
      const substituteIndex = Math.min(Math.max(index, 0), this.tabs.length - 1)
      this.current.value = this.tabs[substituteIndex].id
    }
  },
}
