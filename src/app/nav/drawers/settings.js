import Drawer from './drawer.js'
import SettingsService from './settings.service.js'

export default {
  components: {
    Drawer,
  },
  
  data() {
    return {
      SettingsService,
    }
  },

  methods: {
    openBrowser(url) {
      electron.openBrowser(url)
    }
  },

  template: `
    <drawer title="Settings">
      <h2>HTTP</h2>

      <v-switch 
        v-model="SettingsService.http.followRedirect" 
        label="Follow redirect"
        color="primary"
      ></v-switch>

      <h2>UI</h2>

      <v-select
        v-model="SettingsService.ui.theme"
        :items="['system', 'light', 'dark']"
        label="Theme"
      ></v-select>

      <v-select
        v-model="SettingsService.ui.language"
        :items="['fr', 'en']"
        label="Language"
      ></v-select>


      <div style="display: flex; justify-content: space-evenly;">
        <v-btn
          @click="openBrowser(app.repoUrl + '/releases')"
          prepend-icon="mdi-download"
          variant="text"
        >
          {{ app.version }}
        </v-btn>

        <v-btn
          @click="openBrowser(app.repoUrl)"
          prepend-icon="mdi-source-branch"
          variant="text"
        >
          Source
        </v-btn>
      </div>

    </drawer>
  `
}
