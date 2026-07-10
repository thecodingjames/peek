import { forceFocus } from '../../../core/helpers.js'

import DialogMixin from '../../../core/dialog.mixin.js'

export default {
  mixins: [
    DialogMixin,
  ],

  props: [
    'title',
    'content',
  ],

  emits: [
    'save',
  ],

  data() {
    return {
      value: null,
    }
  },

  watch: {
    content(newContent) {
      if (newContent) {
        this.value = newContent

        forceFocus( () => this.$refs.value )
      }
    },
  },

  methods: {

    handleVisibility(visible, save = false) {
      if (save) {
        this.$emit('save', this.value)
      }

      this.$emit('update:modelValue', visible) 
    },

  },

  template: `
    <p-dialog
      :model-value="!!content"
      @update:model-value="handleVisibility"

      :title
      style="width: 100%; max-width: 768px;"
    >

      <v-textarea 
        ref="value"
        v-model="value"

        variant="outlined"
        hide-details
      />

      <div style="text-align: center; margin-top: 1rem;">
        <v-btn
          @click="handleVisibility(false, true)"
          :text="t.request.details.keyValue.save"
          color="success"
        ></v-btn>
      </div>

    </p-dialog>
  `
}

