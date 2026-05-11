import Panel from './nav/panel.js'
import SettingsService from './nav/drawers/settings.service.js'

export default {
  components: {
    Panel
  },

  data() {
    return {
      SettingsService,
    }
  },

  template: `
    <v-app :theme="SettingsService.ui.theme">
      <div 
        v-if="isDevelopment" 
        style="background-color: red; color: white; padding: 4px; text-align: center;"
      >
        [dev]
      </div>

      <v-layout>
        <panel />

        <v-main>
          <div style="padding: 1rem;">
            <router-view />
          </div>
        </v-main>
      </v-layout>
    </v-app>
  `,

}
