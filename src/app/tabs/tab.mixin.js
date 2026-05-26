import TabsService from './tabs.service.js'

export default {
  props: [
    'tabId',
  ],

  computed: {
    isActiveTab() {
      return this.tabId == TabsService.current.value
    }
  },

}
