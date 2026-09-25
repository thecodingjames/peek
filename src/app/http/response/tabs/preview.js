import SettingsService from '../../../drawers/settings/settings.service.js'

import wrapUtil from './wrap.helper.js'

export default {
  
  props: [ 'response' ],

  data() {
    return {
      previewTimestamp: null,
    }
  },

  computed: {

    iframeSandbox() {
      let sandbox = 'allow-same-origin'

      if (SettingsService.http.previewAllowScripts) {
        sandbox += ' allow-scripts'
      }

      return sandbox
    },

    wrap() {
      return wrapUtil(SettingsService.http.previewWrapText)
    },

    preview() {
      const contentType = this.response?.headers?.['content-type']

      let json = null
      try {
          json = JSON.parse(this.response?.body)
      } catch { }

      if (contentType?.startsWith('image/')) {
        const blob = new Blob([this.response.blob], { type: contentType });
        const url = URL.createObjectURL(blob);

        return {
          type: 'image',
          content: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">

              <style>
                body, html {
                  margin: 0;
                  height: 100%;
                  width: 100%;
                  overflow: hidden;
                }

                img {
                  max-width: 100%;
                  max-height: 100%;
                }
              </style>
            </head>
            <body>
              <img src="${url}" alt="">
            </body>
            </html>
          `
        }
      } else if (json) {
        const highlightedJson = window.hljs.highlight(
          JSON.stringify(json, null, 2),
          {
            language: 'json',
          }
        ).value

        return {
          type: 'json',
          content: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <link rel="stylesheet" href="./vendor/highlight.css">
            </head>
            <body style="margin: 0;">
              <div class="hljs">
                <pre style="margin: 0; ${this.wrap}">${ highlightedJson }</pre>
              </div>
            </body>
            </html>
          `
        }
      } else {
        let html = this.response?.body
          .replace('<head>', `<head><base href="${this.response?.url}/">`)// trailing slash matters
          .replace('<head>', `<head><style>html * { pointer-events: none !important; }</style>`);

        const wrappingBody = `<body style="${this.textWrap}">`
        const wrapped = html.replace('<body>', wrappingBody)

        if (html == wrapped) {
          html = `${wrappingBody}${html}</body>`
        }

        return {
          type: 'html',
          content: `
            ${html}
            <!-- ${ this.previewTimestamp } -->
          `
          // previewTimestamp forces re-render when iframeSandbox changes
        }
      }
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

  template: `
    <iframe
      v-if="response"

      ref="iframe"

      :srcdoc="preview.content"
      :sandbox="iframeSandbox"

      frameborder="0"
      style="width: 100%; height: 100%;"
    ></iframe>
  `
}
