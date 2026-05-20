import HotkeysService from './hotkeys.service.js'

export default {

  model: {
    prop: 'visible',
  },

  emits: [
    'update:modelValue'
  ],

  props: [
    'visible'
  ],

  computed: {

    hotkeys() {
      return HotkeysService.all
    },

  },

  methods: {
    
    handle(visible) {
      this.$emit('update:modelValue', visible)
    },

    prepareForKbd(binding) {
      const meta = this.app.darwin ? 'cmd' : 'ctrl' 

      return binding.replace('meta', meta).split('+')
    },

  },

  template: `
    <v-dialog
      :model-value="visible"
      @update:model-value="handle($event)"
    >
      <v-card>
        <template v-slot:title>
          <div style="display: flex; justify-content: space-between;">
            <div class="text-headline-large">Hotkeys</div>

            <v-btn
              @click="handle(false)"
              icon="mdi-close"
              variant="outlined"
              size="small"
            />
          </div>
        </template>
        <v-card-text style="overflow-y: scroll;" >
          <div v-for="(items, category) in hotkeys">
            <v-table>
              <thead>
                <tr>
                  <th colspan="2" style="font-weight: bold;">
                    {{ category }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(binding, name) in items"
                  :key="name"
                >
                  <td>{{ name }}</td>
                  <td style="width: 192px">
                    <template 
                      v-for="(key, index) in prepareForKbd(binding)"
                    >
                      <span 
                        v-if="index > 0" 
                        style="padding: 0 4px;"
                        v-text="'+'"
                      />
                      <v-kbd>{{ key }}</v-kbd>
                    </template>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  `
}
