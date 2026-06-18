const VisibleMixin = {

  model: {
    prop: 'visible',
  },

  emits: [
    'update:modelValue'
  ],

  props: [
    'visible'
  ],

  watch: {
    visible() {
      this.$emit('update:modelValue', visible)
    }
  },

}

const Dialog = {

  mixins: [
    VisibleMixin,
  ],

  props: [
    'title',
  ],

  methods: {
    
    handleModelValue(visible) {
      this.$emit('update:modelValue', visible)
    },

  },

  template: `
    <v-dialog
      :model-value="visible"
      @update:model-value="handleModelValue($event)"
    >
      <v-card>

        <template v-slot:title>
          <div style="display: flex; justify-content: space-between;">
            <div class="text-headline-small">{{ title }}</div>

            <v-btn
              @click="handleModelValue(false)"
              icon="mdi-close"
              variant="outlined"
              size="x-small"
            />
          </div>
        </template>

        <v-card-text style="overflow-y: auto;">
          <slot></slot>
        </v-card-text>

      </v-card>
    </v-dialog>
  `
}

export default {

  components: {
    'p-dialog': Dialog,
  },

  mixins: [
    VisibleMixin,
  ],

}

/*
import DialogMixin from '../core/dialog.mixin.js'

export default {
  
  mixins: [
    DialogMixin,
  ],

  methods: {
    
    handleVisibility(visible) {

      this.$emit('update:modelValue', visible) 
    },

  },

  template: `
    <p-dialog
      :model-value="visible"
      @update:model-value="handleVisibility"

      :title="..."
    >

      ...

    </p-dialog>
  `
}

//
// USAGE
//

<CUSTOM-dialog :model-value="..." @update:model-value="..." />
*/
