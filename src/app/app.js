import Panel from '/app/nav/panel.js'
import { Curl } from '/vendor/curl.js'

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
    Neutralino.init()
    const curl = new Curl()

    Neutralino.events.on("windowClose", () => {
      Neutralino.app.exit()
    });

    this.dev = await Neutralino.os.getEnv('DEV')

    if (!this.dev) {
      window.addEventListener('contextmenu', (event) => {
        event.preventDefault()
      })
    }

    let result = await curl.get('https://httpbin.org/base64/SFRUUEJJTiBpcyBhd2Vzb21l');
    console.log(result)
    document.addEventListener('curlData', (e) => {
      alert(e.detail)
    })
  }

}
