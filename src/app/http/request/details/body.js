import EditableKeyValue from './key-value/key-value.js'

export default {
  components: {
    EditableKeyValue,
  },

  props: [
    'body',

    'create',
    'edit',
    'sort',
    'delete',
  ],

  computed: {

    altInputs() {
      return [
        {
          name: 'file',
          tag: 'v-file-input',
          default: [],
          label: this.t.request.details.keyValue.fileValueLabel,
          icon: 'mdi-paperclip',
        }
      ]
    },

  },

  methods: {

    handleEncodingToggle() {
      const encoding = {
        urlencoded: 'multipart',
        multipart: 'urlencoded',
      }[this.body.mode.encoding]

      this.body.mode.encoding = encoding
    },

    disabled(item) {
      const d =  this.body.mode.name == 'urlencoded' && item.value instanceof File
      console.log(d)
      return d
    },

  },

  template: `
    <div
      v-if="body.isKeyValue"
    >
      <div style="margin-top: -0.5rem;">
        <EditableKeyValue

          :items="body.pairs"
          :altInputs

          @create="create"
          @edit="edit"
          @sort="sort"
          @delete="$props.delete"

          :disabled="disabled"
        >
          <template v-slot:prepend>
            <span
              @click.prevent="handleEncodingToggle"
              class="text-label-small"
              style="cursor: pointer; width: fit-content; margin-top: -0.5rem; margin-left: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>urlencoded</span>

              <v-switch
                v-model="body.mode.encoding"

                false-value="urlencoded"
                true-value="multipart"

                density="compact"
                hide-details
                style="transform: scale(0.7);"
              />

              <span>multipart</span>
            </span>
          </template>

        </EditableKeyValue>
      </div>
    </div>

    <v-textarea 
      v-else
      v-model="body.raw"

      style="margin: 0.5rem;"
      variant="outlined"
      hide-details
    />
  `
}
