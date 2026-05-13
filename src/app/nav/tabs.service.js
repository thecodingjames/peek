const defaultTab = {
  id: 0,
  title: 'Request',
}

const tabs = Vue.reactive([
  defaultTab,
])

export default {
  tabs,

  new() {
    const ids = this.tabs.map( t => {
      const match  = t.title.match(/^New request (\d+)$/)
      
      return Number(match?.[1] ?? 0)
    })

    const next = Math.max(...ids) + 1

    this.tabs.unshift({
      id: crypto.randomUUID(),
      title: `New request ${next}`,
    })
  },

  remove(id) {
    const index = this.tabs.findIndex( t => t.id == id )
    this.tabs.splice(index, 1)
  },
}
