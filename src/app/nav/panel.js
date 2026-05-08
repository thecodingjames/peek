import History from './drawers/history.js'
import Settings from './drawers/settings.js'

export default {
  components: {
    History,
    Settings
  },

  data() {
    return {
      selected: [],
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

    current() {
      return this.selected[0]
    }
  },

  template: `
    <v-navigation-drawer
      :rail="true"
      permanent
    >
      <v-list 
        v-model:selected="selected"
        selectable
        nav
        density="compact"
      >
        <v-list-item
          v-for="(option, name) in options"

          :active="current == name"
          :prepend-icon="option.icon"
          :title="t.nav[name]"
          :value="name"
          v-tooltip="{text: t.nav[name], openDelay: 1000}"
        />
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer 
      :permanent="!!current"
      :mobile="true"
    >
      <component v-if="!!current" :is="options[current].component"></component>
    </v-navigation-drawer>
  `
}
