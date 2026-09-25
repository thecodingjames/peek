import ResponseModel from './response.model.js'
import SettingsService from '../../drawers/settings/settings.service.js'

import Body from './tabs/body.js'
import Headers from './tabs/headers.js'
import Preview from './tabs/preview.js'

import TabMixin from '../../tabs/tab.mixin.js'

export default {
  components: {
    Body,
    Headers,
    Preview,
  },

  mixins: [
    TabMixin,
  ],

  props: [
    'response',
  ],

  data() {
    return {
      tab: 'body',
    }
  },

  computed: {

    tooltipText() {
      const redirectText = this.response.redirected ? ` [${this.t.response.tabs.raw.redirected}]` : ''

      return `${this.response.statusText}${redirectText}`
    },

    statusColor() {
      return `text-${ResponseModel.statusColor(this.response.code)}`
    },

  },

  template: `
    <div
      class="_http_response"
      style="height: 100%; overflow: hidden; display: flex; flex-direction: column; gap: 1.5rem;"
    >

      <component is="style">
        ._http_response {
          .v-tabs-window-item {
            overflow: hidden;
          }

          .v-tabs-window-item > :first-child {
            overflow: auto;
            max-height: 100%;
          }
        }
      </component>

      <div style="display: flex; align-items: baseline; gap: 0.5rem;">
        <div class="section-title">
          {{ t.response.title }}
        </div>

        <v-chip
          v-if="response"
          color="gray"
          label
          variant="tonal"
          size="small"
          density="comfortable"
        >
          {{ response.formattedDuration }}
        </v-chip>
      </div>

      <div
        v-if="response"
        style="overflow: hidden; display: flex; flex-direction: column; flex-grow: 1;"
      >
        <v-tabs
          v-model="tab"

          style="flex-shrink: 0;"
        >

          <v-tab 
            value="body" 
            v-tooltip="{ text: tooltipText, openDelay: 300}"
          >
            <b :class="statusColor">{{ response.code }}</b>

            <v-icon v-if="response.redirected" icon="mdi-chevron-double-right"></v-icon>
          </v-tab>

          <v-tab value="headers">{{ t.response.tabs.headers.title }}</v-tab>

          <v-tab value="preview">{{ t.response.tabs.preview.title }}</v-tab>

        </v-tabs>

        <v-divider></v-divider>

        <v-tabs-window
          v-model="tab"

          style="overflow: hidden; height: 100%;"
        >
          <v-tabs-window-item value="body">
            <Body :body="response.body" />
          </v-tabs-window-item>

          <v-tabs-window-item value="headers">
            <Headers :headers="response.headers" />
          </v-tabs-window-item>

          <v-tabs-window-item value="preview">
            <Preview :response />
          </v-tabs-window-item>

        </v-tabs-window>
      </div>

      <span v-else-if="response === undefined" style="font-style: italic;">{{ t.response.pending }}</span>

      <span v-else-if="response === null" class="text-red">{{ t.response.error }}</span>
    </div>
  `
}
