import SettingsService from '../../../drawers/settings/settings.service.js'

import { wrap as wrapUtil, background as backgroundUtil } from './styles.helper.js'

export default {

  props: [ 'body' ],

  computed: {

    wrap() {
      return wrapUtil(SettingsService.http.bodyWrapText)
    },

    background() {
      return backgroundUtil('._http_response_tabs_body')
    },

  },

  template: `
    <component is="style">
      {{ background }}

      ._http_response_tabs_body {
        height: 100%;
        overflow: auto;
      }
    </component>

    <pre 
      class="_http_response_tabs_body border border-t-0 rounded-t-0 rounded-md"

      style="
        margin: 0;
        padding: 0.5rem;
        user-select: text;
        cursor: text;
      "
      :style="wrap"
    >{{ body }}</pre>
  `
}
