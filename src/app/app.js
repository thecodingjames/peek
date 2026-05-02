import Panel from './nav/panel.js'

export default {
  components: {
    Panel
  },

  data() {
    return {
      dev: false,
    }
  },

  template: `
    <v-app>

      <div 
        v-if="!!dev" 
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
    this.dev = false // TODO

    if (!this.dev) {
      window.addEventListener('contextmenu', (event) => {
        event.preventDefault()
      })
    }

  }

}
