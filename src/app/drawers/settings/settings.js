import Drawer from '../drawer.js'
import HotkeysDialog from '../../hotkeys/hotkeys-dialog.js'

import SettingsService from './settings.service.js'

export default {
  components: {
    Drawer,
    HotkeysDialog,
  },

  emits: [
    'hotkeysClick',
  ],
  
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
          title: this.t.drawers.settings[theme],
        }
      })
    },

  },

  methods: {
    
    handleHotkeys() {
      this.$emit('hotkeysClick')
    },

    openBrowser(url) {
      electron.openBrowser(url)
    }

  },

  template: `
    <drawer :title="t.drawers.settings.title">
      <component is="style">
        .nav_drawers_settings {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .nav_drawers_settings>* {
          margin: 0;
        }
      </component>

      <div class="nav_drawers_settings">
        <h2>HTTP</h2>

        <v-switch
          v-model="SettingsService.http.followRedirect"
          :label="t.drawers.settings.followRedirect"
          color="primary"
          :hide-details="true"
        ></v-switch>

        <h2>{{ t.drawers.settings.appearance }}</h2>

        <v-switch
          v-model="SettingsService.ui.alwaysShowTabs"
          :label="t.drawers.settings.alwaysShowTabs"
          color="primary"
          :hide-details="true"
        ></v-switch>

        <v-select
          v-model="SettingsService.ui.theme"
          :items="themeItems"
          :label="t.drawers.settings.theme"
          hide-details
        ></v-select>

        <v-select
          v-model="SettingsService.ui.language"
          :items="['fr', 'en']"
          :label="t.drawers.settings.language"
          hide-details
        ></v-select>

        <v-btn
          @click="handleHotkeys()"
          prepend-icon="mdi-keyboard-outline"
          style="width: 100%;"
        >
          {{ t.drawers.settings.keyBindings }}
        </v-btn>

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
      </div>

    </drawer>
  `
}
