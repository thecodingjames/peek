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
    'update:modelValue',
    'click:clear',
  ],

  methods: {

    handleClick() {
      this.$refs.picker.click()
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      const reader = new FileReader()

      reader.addEventListener("load", () => {
        this.$emit('update:modelValue',  {
          content: reader.result,
          filename: file.name,
          type: file.type,
        })
      })

      reader.readAsText(file)
    },

    handleClear() {
      this.$emit('click:clear')
    },

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

        @change="handleFileSelect"

        type="file" 
        hidden
      >
      
      <v-text-field 
        :modelValue
        @click:clear="handleClear"

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
