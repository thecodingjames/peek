export default {

  data() {
    return {
      drawer: true ,
      dev: false,
    }
  },

  template: `
      <v-app>
          <v-layout>
      <v-navigation-drawer
        v-model="drawer"
        :rail="true"
        color="indigo"
        permanent
      >
        <v-list density="compact" nav>
          <v-list-item
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

      <v-main style="height: 250px">
       <h1>main</h1>
       {{ (!!dev).toString() }}
      </v-main>
    </v-layout>
      </v-app>
  `,

  async mounted() {
    Neutralino.init();

    Neutralino.events.on("windowClose", () => {
      Neutralino.app.exit();
    });

    Neutralino.app.getConfig().then( c => {
      // this.dev = c.devMode
    })

    this.dev = await Neutralino.os.getEnv('DEV');
  }

}
