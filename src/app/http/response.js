import ResponseModel from './response.model.js'

import TabMixin from '../tabs/tab.mixin.js'

export default {
  mixins: [
    TabMixin,
  ],

  props: [
    'response',
  ],

  data() {
    return {
      tab: 'body'
    }
  },

  computed: {

    html() {
      // TODO add more content types detection
      return this.response?.blob?.replace('<head>', `<head><base href="${this.response?.url}">`);
    },

    tooltipText() {
      const redirectText = this.response.redirected ? ` [${this.t.response.tabs.raw.redirected}]` : ''

      return `${this.response.statusText}${redirectText}`
    },

    statusColor() {
      return `text-${ResponseModel.statusColor(this.response.code)}`
    }

  },

  template: `
    <div>

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

      <div v-if="response">
        <v-tabs v-model="tab">
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

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="body">
            <pre style="user-select: text; cursor: text;">{{ response.blob }}</pre>
          </v-tabs-window-item>

          <v-tabs-window-item value="headers">
            <v-table striped="even" style="user-select: text;">
              <tbody>
                <tr
                  v-for="(value, name) in response.headers"
                  :key="name"
                >
                  <td style="user-select: text; cursor: text; white-space: nowrap;">{{ name }}</td>
                  <td style="user-select: text; cursor: text;">{{ value }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-tabs-window-item>

          <v-tabs-window-item value="preview">
            <iframe 
              v-if="response" 
              :srcdoc="html" frameborder="0"
              style="width: 100%; height: 100dvh;"
            ></iframe>
          </v-tabs-window-item>

        </v-tabs-window>
      </div>

      <span v-else-if="response === undefined" style="font-style: italic;">{{ t.response.pending }}</span>

      <span v-else-if="response === null" class="text-red">{{ t.response.error }}</span>
    </div>
  `
}
