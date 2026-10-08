import HotkeysDialog from '../../hotkeys/hotkeys-dialog.js'
import UpdateDialog from './update-dialog.js'

import SettingsService from './settings.service.js'

export default {
  components: {
    HotkeysDialog,
    UpdateDialog,
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
    },

    handleCheckUpdatesNow() {
      this.$refs.updateDialog.check()
    },

  },

  watch: {

    'SettingsService.checkForUpdates'(check) {
      if (check) {
        this.handleCheckUpdatesNow()
      }
    },

  },

  template: `
    <div>
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

        <h3>{{ t.drawers.settings.request }}</h3>

        <v-switch
          v-model="SettingsService.http.followRedirect"
          :label="t.drawers.settings.followRedirect"
          color="primary"
          :hide-details="true"
        ></v-switch>

        <h3>{{ t.drawers.settings.response }}</h3>

        <v-switch
          v-model="SettingsService.http.bodyWrapText"
          :label="t.drawers.settings.bodyWrapText"
          color="primary"
          :hide-details="true"
        ></v-switch>

        <v-switch
          v-model="SettingsService.http.previewWrapText"
          :label="t.drawers.settings.previewWrapText"
          color="primary"
          :hide-details="true"
        ></v-switch>

        <v-switch
          v-model="SettingsService.http.previewAllowScripts"
          :label="t.drawers.settings.previewAllowScripts"
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

        <div style="display: flex; flex-wrap: wrap; column-gap: 1rem; align-items: center;">
          <v-switch
            v-model="SettingsService.checkForUpdates"
            :label="t.drawers.settings.updates.checkForUpdates"
            color="primary"
            :hide-details="true"
          ></v-switch>

          <v-btn
            @click="handleCheckUpdatesNow()"
            prepend-icon="mdi-help-circle-outline"

            style="flex-grow: 1;"
          >
            {{ t.drawers.settings.updates.checkNow }}
          </v-btn>
        </div>

        <div style="display: flex; justify-content: space-evenly;">
          <v-btn
            @click="openBrowser(app.repoUrl + '/releases#release-v' + app.version)"
            prepend-icon="mdi-information-outline"
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

      <UpdateDialog ref="updateDialog" />
    </div>

  `
}
