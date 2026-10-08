import UpdateService from '../update/update.service.js'

export default {

  data() {
    return {
      checking: false,
      available: undefined,
    }
  },

  computed: {

    hasResult() {
      return this.available !== undefined
    },

    message() {
      switch (this.available) {
        case null:
          return this.t.drawers.settings.updates.dialog.error

        case true:
          return this.t.drawers.settings.updates.dialog.updateAvailable

        case false:
          return this.t.drawers.settings.updates.dialog.upToDate

        default:
          return this.t.drawers.settings.updates.dialog.checking
      }
    },

  },

  methods: {
    async check() {
      this.available = undefined
      this.checking = true

      let available = null
      try {
        available = await UpdateService.check(true)
      } 
      catch {
        /* available is null by default, generic error message */
      }
      finally {
        setTimeout(() => {
          if (this.checking) {
            this.available = available
          }
        }, 333)
        // Deliberate delay, to avoid loading animation flicker
      }
    },

    handleClose() {
      this.checking = false
    },

    handleOpenDownload() {
      electron.openBrowser(UpdateService.latestReleaseUrl)
    },

  },

  template: `
    <v-dialog
      v-model="checking"

      :persistent="!hasResult"
      max-width="400"
    >
      <v-card> 
        <template v-slot:title>
          {{ t.drawers.settings.updates.dialog.title }}

          <v-progress-circular
            v-if="!hasResult"
            color="primary"
            indeterminate="disable-shrink"
            size="24"
            width="2"
          ></v-progress-circular>
        </template>

        <template 
          v-slot:text
        >
          {{ message }}
        </template>

        <template
          v-slot:actions
        >
          <v-btn
            v-if="available"
            :text="t.drawers.settings.updates.dialog.openDownload"
            color="primary"
            @click="handleOpenDownload()"
          ></v-btn>
          
          <v-btn
            :text="t.drawers.settings.updates.dialog.close"
            @click="handleClose()"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  `
}
