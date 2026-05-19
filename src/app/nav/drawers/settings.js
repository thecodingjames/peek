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

  computed: {
    themeItems() {
      return ['system', 'light', 'dark'].map( theme => {
        return {
          value: theme,
          title: this.t.panels.settings[theme],
        }
      })
    },

  },

  methods: {
    openBrowser(url) {
      electron.openBrowser(url)
    }
  },

  template: `
    <drawer :title="t.panels.settings.title">
      <h2>HTTP</h2>

      <v-switch 
        v-model="SettingsService.http.followRedirect" 
        :label="t.panels.settings.followRedirect"
        color="primary"
      ></v-switch>

      <h2>{{ t.panels.settings.appearance }}</h2>

      <v-select
        v-model="SettingsService.ui.theme"
        :items="themeItems"
        :label="t.panels.settings.theme"
      ></v-select>

      <v-select
        v-model="SettingsService.ui.language"
        :items="['fr', 'en']"
        :label="t.panels.settings.language"
      ></v-select>

      <h2>Application</h2>

      <div style="display: flex; justify-content: space-between;">
        <v-btn
          @click="openBrowser(app.repoUrl + '/releases')"
          prepend-icon="mdi-download"
        >
          {{ app.version }}
        </v-btn>

        <v-btn
          @click="openBrowser(app.repoUrl)"
          prepend-icon="mdi-source-branch"
        >
          Source
        </v-btn>
      </div>

    </drawer>
  `
}
