import MessageCard from './message-card.js'

export default {
  components: {
    MessageCard,
  },

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
      const redirectText = this.response.redirected ? ' [redirected]' : ''

      return `${this.response.statusText}${redirectText}`
    },

    statusColor() {
      const code = this.response.code

      if (code >= 200 && code < 300) {
        return 'text-green'
      } else if (code >= 400 && code < 500) {
        return 'text-orange'
      } else if (code > 500) {
        return 'text-red'
      } else {
        return 'text-grey'
      }
    }

  },

  template: `
    <message-card
      title="response"
    >
      <div v-if="response">
        <v-tabs v-model="tab">
          <v-tab 
            value="body" 
            v-tooltip="{ text: tooltipText, openDelay: 300}"
          >
            <b :class="statusColor">{{ response.code }}</b>

            <v-icon v-if="response.redirected" icon="mdi-chevron-double-right"></v-icon>
          </v-tab>
          <v-tab value="headers">Headers</v-tab>
          <v-tab value="preview">Preview</v-tab>
        </v-tabs>

        <v-divider></v-divider>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="body">
            <pre style="user-select: text; cursor: text;">{{ response.blob }}</pre>
          </v-tabs-window-item>

          <v-tabs-window-item value="headers">
            {{ JSON.stringify(response.headers) }}
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

      <p v-else>Nothing to show...</p>
    </message-card>
  `
}
