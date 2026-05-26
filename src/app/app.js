import Drawers from './drawers/drawers.js'
import Tabs from './tabs/tabs.js'

import SettingsService from './drawers/settings/settings.service.js'

export default {
  components: {
    Drawers,
    Tabs,
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
          v-if="app.development"
          class="bg-red"
          style="color: white; padding: 4px; text-align: center;"
        >
          [dev]
        </div>

        <v-layout>
          <drawers />

          <v-main>
            <tabs />
          </v-main>
        </v-layout>
      </v-app>
    </v-defaults-provider>
  `,

}
