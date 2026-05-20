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

  data() {
    return {
      editing: null,
    }
  },

  computed: {

    hotkeys() {
      return HotkeysService.all
    },

  },

  methods: {
    
    handleVisibility(visible) {
      this.$emit('update:modelValue', visible)
    },

    prepareForKbd(binding) {
      const meta = this.app.darwin ? 'cmd' : 'ctrl' 

      return binding.replace('meta', meta).split('+')
    },

    handleEditBinding(category, name) {
      this.editing = this.currentId(category, name)
    },

    currentId(category, name) {
      return category + '.' + name
    },

    currentEdit(category, name) {
      return this.editing == this.currentId(category, name)
    },

  },

  template: `
    <v-dialog
      :model-value="visible"
      @update:model-value="handleVisibility($event)"

    >

      <component is="style">
        .hotkeys_hotkeys-dialog-card {
          tr:hover {
            --opacity: calc(var(--v-activated-opacity) * var(--v-high-emphasis-opacity));
            background-color: color-mix(in srgb, currentColor calc(var(--opacity) * 100%), transparent);
          }

          .binding {
            display: flex;
            justify-self: end;
            padding: 8px;
          }

          .binding,.binding:hover * {
            cursor: pointer;
          }
        }
      </component>

      <v-card class="hotkeys_hotkeys-dialog-card">
        <template v-slot:title>
          <div style="display: flex; justify-content: space-between;">
            <div class="text-headline-large">Hotkeys</div>

            <v-btn
              @click="handleVisibility(false)"
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
                  <td style="text-align: right; width: 0; white-space: nowrap;" >
                    <span 
                      @click="handleEditBinding(category, name)"
                      class="binding"
                    >
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
                      <span v-if="currentEdit(category, name)">
                        {{ JSON.stringify(editing) }}
                      </span>
                    </span>
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
