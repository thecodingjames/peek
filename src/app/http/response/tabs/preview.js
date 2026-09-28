import SettingsService from '../../../drawers/settings/settings.service.js'

import { wrap as wrapUtil, background as backgroundUtil } from './styles.helper.js'

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

      const htmlWrap = (body, bodyStyle = null) => {
        return `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">

            <style>
              ${ backgroundUtil('html') }
            </style>

            <style>
              body {
                ${bodyStyle ?? ''}
                margin: 0;
              }
            </style>
          </head>
          <body>
            ${ body }
          </body>
          </html>
        `
      }

      let json = null
      try {
          json = JSON.parse(this.response?.body)
      } catch { }

      if (contentType?.startsWith('image/')) {
        const blob = new Blob([this.response.blob], { type: contentType });
        const url = URL.createObjectURL(blob);

        return {
          type: 'image',
          content: htmlWrap(
            `<img src="${url}" style="max-width: 100%; max-height: 100%;">`,
            `
              margin: 0;
              height: 100%;
              width: 100%;
              overflow: hidden;
            `
          )
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
          content: htmlWrap(`
            <link rel="stylesheet" href="./vendor/highlight.css">
            <div class="hljs">
              <pre style="margin: 0; font-size: 1rem; padding: 0.5rem; ${this.wrap}">${ highlightedJson }</pre>
            </div>
          `)
        }
      } else {
        let html = this.response?.body
          .replace('<head>', `<head><base href="${this.response?.url}/">`)// trailing slash matters
          .replace('<head>', `<head><style>html * { pointer-events: none !important; }</style>`);

        const style = `${this.wrap} overflow: auto;`
        if (html.match('</body>')) {
          html = html.replace(
            '</body>',
            `
              <style>
                body {
                  ${style}
                }
              <style>
              </body>
            `
          )
        } else {
          html = htmlWrap(
            html,
            `
              ${style}
              padding: 0.5rem;

              @media (prefers-color-scheme: light) {
                color: black;
              }
              @media (prefers-color-scheme: dark) {
                color: white;
              }
            `
          )
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

      class="border border-t-0 rounded-t-0 rounded-md"
      style="width: 100%; height: 100%;"
    ></iframe>
  `
}
