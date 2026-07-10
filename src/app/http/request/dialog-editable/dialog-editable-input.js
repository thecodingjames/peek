export default {

  props: [
    'modelValue',
    'label',
    'prependInnerIcon',
  ],

  emits: [
    'update:modelValue',

    'clear',
    'openDialog',
  ],

  template: `
    <v-text-field
      :modelValue
      @update:modelValue="$emit('update:modelValue', $event)"

      @click:clear="$emit('clear')"

      :label
      :prependInnerIcon

      prepend-icon=""
      single-line
      density="compact"
      hide-details

      class="_http_request_dialog_editable_input"
    >
      <template v-slot:prepend-inner>
        <component is="style">
          ._http_request_dialog_editable_input {
            .v-field__input {
              padding: 0 0.5rem 0 0;
              align-self: center;
            }
          }
        </component>

        <v-btn
          @click="$emit('openDialog')"
          style="margin-left: -0.75rem; aspect-ratio: 1; min-width: 0;"
          variant="text"
        >
          <v-icon icon="mdi-arrow-expand" />
        </v-btn>
      </template>
    </v-text-field>
  `
}
