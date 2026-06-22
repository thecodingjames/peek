export default {
  props: [
    'modelValue',
    'label',
    'prependInnerIcon',
    'prependIcon',
    'singleLine',
    'density',
    'hide-details',
    'class',
  ],

  emits: [
    'click:clear',
  ],

  methods: {

    handleClick() {
      this.$refs.picker.click()
    }

  },

  template: `
    <div 
      @click="handleClick"

      class="_http_request_details_body__file_input"
      style="flex-grow: 1;"
    >
      <component is="style">
        ._http_request_details_body__file_input:hover * {
          cursor: pointer !important;
        }
      </component>

      <input 
        ref="picker" 

        type="file" 
        hidden
      >
      
      <v-text-field 
        readonly

        clearable
        persistent-clear
        persistent-placeholder
        :placeholder="label"

        :prependInnerIcon
        :prependIcon
        :singleLine
        :hide-details
        :density

        :class="[$props.class]"
      />
    </div>
  `
}
