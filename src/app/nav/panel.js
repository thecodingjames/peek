export default {
  data() {
    return {
      selected: [],
    }
  },

  computed: {
    options() {
      return [ 
        {
          component: 'History',
          icon: 'mdi-history',
        },
        {
          component: 'Settings',
          icon: 'mdi-cog',
        },
      ]
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
          v-for="option in options"

          :active="current == option.component"
          :prepend-icon="option.icon"
          :title="option.component"
          :value="option.component"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer :permanent="!!current">
      <h1>nav drawer</h1>
    </v-navigation-drawer>
  `
}
