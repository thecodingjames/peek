import Popup, { mixin as popupMixin } from '../../popups/popup.js'

export default {
  emits: [
    'rename',
  ],
  
  methods: {

    handleRename(name) {
      this.$emit('rename', name)
    },

  },

}
