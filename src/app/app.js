import Panel from './nav/panel.js'

export default {
  components: {
    Panel
  },

  data() {
    return {
    }
  },

  template: `
    <v-app>
      <div 
        v-if="isDevelopment" 
        style="background-color: red; color: white; padding: 4px; text-align: center;"
      >
        [dev]
      </div>

      <v-layout>
        <panel />

        <v-main>
          <router-view />
        </v-main>
      </v-layout>
    </v-app>
  `,

  async mounted() {
  }

}
