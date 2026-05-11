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

  computed: {

    defaults() {
      return {
        'global': {
          ripple: false,
          variant: 'outlined',
          density: 'comfortable',
        },
        'VBtn': {
          density: 'default',
        },
        'VBtnGroup': {
          density: 'default',
        },
        'VNavigationDrawer': {
          'VList': {
            variant: 'text',
          },
        },
        'VTab': {
          variant: 'text',
        },
      }
    },

  },

  template: `
    <v-defaults-provider :defaults >
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
    </v-defaults-provider>
  `,

}
