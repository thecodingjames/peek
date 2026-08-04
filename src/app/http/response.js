import ResponseModel from './response.model.js'
import SettingsService from '../drawers/settings/settings.service.js'

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
      tab: 'body',

      previewTimestamp: null,
    }
  },

  computed: {

    body() {
      return new TextDecoder().decode(this.response.blob)
    },

    html() {
      const contentType = this.response?.headers?.['content-type']

      if (contentType?.startsWith('image/')) {
        const blob = new Blob([this.response.blob], { type: contentType });
        const url = URL.createObjectURL(blob);

        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">

            <style>
              body, html {
                margin: 0;
                height: 100%;
                width: 100%;
              }

              body {
               background-image: url(${url});
              }
            </style>
          </head>
          <body>
          </body>
          </html>
        `
      } else {
        const html = this.body.replace('<head>', `<head><base href="${this.response?.url}/">`);
        // trailing slash matters

        return `
          ${html}
          <!-- ${ this.previewTimestamp } -->
        `
        // previewTimestamp forces re-render when iframeSandbox changes
      }
    },

    tooltipText() {
      const redirectText = this.response.redirected ? ` [${this.t.response.tabs.raw.redirected}]` : ''

      return `${this.response.statusText}${redirectText}`
    },

    statusColor() {
      return `text-${ResponseModel.statusColor(this.response.code)}`
    },

    iframeSandbox() {
      let sandbox = 'allow-same-origin'
      // needed to access iframe's content document height

      if (SettingsService.http.previewAllowScripts) {
        sandbox += ' allow-scripts'
      }

      return sandbox
    },

  },

  watch: {

    iframeSandbox() {
      Vue.nextTick(() => {
        // let iframe get correct sandbox attribute, then re-render
        this.previewTimestamp = Date.now()
      })
    },

  },

  methods: {

    iframeLoad() {
      this.$refs.iframe.style.height = ''
      // clear height to get new srcdoc rendered size

      const content = this.$refs.iframe.contentDocument
      const height = content.documentElement.scrollHeight + 1
      // + 1 to avoid scrollbars when height is decimal

      // TODO wip image preview size
      // const height = this.$refs.iframe.closest('.v-window-item').getBoundingClientRect().height

      this.$refs.iframeWrapper.style.height = `${height}px`
      this.$refs.iframe.style.height = '100%'
    }

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
            height: 100%;
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
            <pre style="margin: 0; padding: 0.25rem; user-select: text; cursor: text;">{{ body }}</pre>
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
            <div> <!-- preview scroll container -->
              <div
                ref="iframeWrapper"

                style="position: relative;"
              > <!-- iframe wrapper -->
                <iframe
                  v-if="response"

                  ref="iframe"
                  @load="iframeLoad()"

                  :srcdoc="html"
                  :sandbox="iframeSandbox"

                  frameborder="0"
                  style="width: 100%; height: 100%;"
                ></iframe>

                <div style="position: absolute; inset: 0; background: transparent;"></div>
              </div>
            </div>

          </v-tabs-window-item>

        </v-tabs-window>
      </div>

      <span v-else-if="response === undefined" style="font-style: italic;">{{ t.response.pending }}</span>

      <span v-else-if="response === null" class="text-red">{{ t.response.error }}</span>
    </div>
  `
}
