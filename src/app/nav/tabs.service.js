const defaultTab = {
  id: 0,
  title: 'Request',
}

export default {
  current: Vue.ref(0),

  tabs: Vue.reactive([
    defaultTab,
  ]),

  new() {
    const ids = this.tabs.map( t => {
      const match  = t.title.match(/^New request (\d+)$/)
      
      return Number(match?.[1] ?? 0)
    })

    const next = Math.max(...ids) + 1
    const id = crypto.randomUUID()

    this.tabs.unshift({
      id,
      title: `New request ${next}`,
    })

    this.current.value = id
  },

  remove(id) {
    const index = this.tabs.findIndex( t => t.id == id )
    this.tabs.splice(index, 1)
  },
}
