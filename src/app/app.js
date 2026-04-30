export default {

  data() {
    return {
      drawer: true ,
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
        <v-navigation-drawer
          v-model="drawer"
          :rail="true"
          color="indigo"
          permanent
        >
          <v-list density="compact" nav>
            <v-list-item
              :active="true"
              prepend-icon="mdi-history"
              title="History"
              value="1"
            ></v-list-item>

            <v-list-item
              prepend-icon="mdi-cog"
              title="Settings"
              value="1"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-navigation-drawer :permanent="true">
          <h1>nav drawer</h1>
        </v-navigation-drawer>

        <v-main>
          <router-view />
        </v-main>
      </v-layout>
    </v-app>
  `,

  async mounted() {
    Neutralino.init();

    Neutralino.events.on("windowClose", () => {
      Neutralino.app.exit();
    });

    this.dev = await Neutralino.os.getEnv('DEV');

    if (!this.dev) {
      window.addEventListener('contextmenu', (event) => {
        event.preventDefault()
      })
    }
  }

}
