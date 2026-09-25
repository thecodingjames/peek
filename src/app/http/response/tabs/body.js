import SettingsService from '../../../drawers/settings/settings.service.js'

import wrapUtil from './wrap.helper.js'

export default {

  props: [ 'body' ],

  computed: {

    wrap() {
      return wrapUtil(SettingsService.http.bodyWrapText)
    },

  },

  template: `
    <pre 
      style="
        margin: 0;
        padding: 0.25rem;
        user-select: text;
        cursor: text;
      "
      :style="wrap"
    >{{ body }}</pre>
  `
}
