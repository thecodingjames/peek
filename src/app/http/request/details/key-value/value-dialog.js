import { forceFocus } from '../../../../core/helpers.js'

import DialogMixin from '../../../../core/dialog.mixin.js'

export default {
  mixins: [
    DialogMixin,
  ],

  props: [
    'item',
  ],

  data() {
    return {
      value: null,
    }
  },

  watch: {
    item(newItem) {
      if (newItem) {
        this.value = newItem.value.content

        forceFocus( () => this.$refs.value )
      }
    },
  },

  methods: {

    handleVisibility(visible, save = false) {
      if (save) {
        this.item.value.content = this.value
      }

      this.$emit('update:modelValue', visible) 
    },

  },

  template: `
    <p-dialog
      :model-value="!!item"
      @update:model-value="handleVisibility"

      :title="item?.key"
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

