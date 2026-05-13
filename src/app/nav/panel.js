import TabsService from './tabs.service.js'
import History from './drawers/history.js'
import Settings from './drawers/settings.js'

export default {
  components: {
    History,
    Settings
  },

  data() {
    return {
      current: undefined,
    }
  },

  computed: {
    options() {
      return {
        history: {
          component: History,
          icon: 'mdi-history',
        },
        settings: {
          component: Settings,
          icon: 'mdi-cog',
        },
      }
    },

    drawer() {
      return this.options[this.current]?.component
    },

  },

  methods: {

    handleNewRequest(event) {
      TabsService.new()
    },

    handleDrawerItem(name) {
      if (name == this.current) {
        this.current = undefined
      } else {
        this.current = name
      }
    },

  },

  template: `
    <v-navigation-drawer
      :rail="true"
      permanent
    >
      <v-list nav>
        <v-list-item
          @click="handleNewRequest" 
          prepend-icon="mdi-plus"
          title="New request"
          value="new"
          :active="false"
          v-tooltip="{text: 'New request', openDelay: 1000}"
        />

        <v-list-item
          v-for="(option, name) in options"

          @click="handleDrawerItem(name)" 
          :active="current == name"
          :prepend-icon="option.icon"
          :title="t.nav[name]"
          :value="name"
          v-tooltip="{text: t.nav[name], openDelay: 1000}"
        />
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer 
      :permanent="!!drawer"
      :mobile="true"
    >
      <component v-if="!!drawer" :is="drawer"></component>
    </v-navigation-drawer>
  `
}
