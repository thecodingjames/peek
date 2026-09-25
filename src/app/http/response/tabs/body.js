import SettingsService from '../../../drawers/settings/settings.service.js'

export default {

  props: [ 'body' ],

  computed: {

    wrap() {
      return SettingsService.http.bodyWrapText ? 'wrap' : 'nowrap'
    },

  },

  template: `
    <pre 
      style="
        margin: 0;
        padding: 0.25rem;
        user-select: text;
        cursor: text;
        word-wrap: anywhere;
      "

      :style="{ textWrap: wrap }"
    >{{ body }}</pre>
  `
}
