import DialogMixin from '../core/dialog.js'

import HotkeysService from './hotkeys.service.js'

export default {
  
  mixins: [
    DialogMixin,
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
      if(!visible) {
        this.editing = null
      }

      this.$emit('update:modelValue', visible) 
    },

    bindingForPlatform(binding) {
      const meta = this.app.darwin ? 'cmd' : 'ctrl' 

      return binding.replace('meta', meta)
    },

    handleEditBinding(category, name) {
      const id = this.currentId(category, name)
      this.editing = {
        id,
        binding: HotkeysService.binding(id)
      }
    },

    currentId(category, name) {
      return category + '.' + name
    },

    currentEdit(category, name) {
      return this.editing?.id == this.currentId(category, name)
    },

    handleSaveBinding() {
      const {id, binding} = this.editing

      HotkeysService.update(id, binding)

      this.editing = null
    },

  },

  template: `
    <p-dialog
      :model-value="visible"
      @update:model-value="handleVisibility"

      :title="t.hotkeys.dialog.title"

      class="hotkeys_hotkeys-dialog-card"
    >
      <component is="style">
        .hotkeys_hotkeys-dialog-card {
          tbody tr:hover {
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

          input {
            text-align: center;
          }
        }
      </component>

      <div v-for="(items, category) in hotkeys">
        <v-table>
          <thead>
            <tr>
              <th colspan="2" style="font-weight: bold;">
                {{ t.hotkeys[category].title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(binding, name) in items"
              :key="name"
            >
              <td>{{ t.hotkeys[category][name].title }}</td>
              <td style="text-align: right; width: 0; white-space: nowrap;" >

                <form
                  v-if="editing?.id == currentId(category, name)"
                  @submit.prevent="handleSaveBinding(category, name)"
                >
                  <v-text-field
                    :model-value="bindingForPlatform(binding)"
                    @update:model-value="editing.binding = $event"

                    style="text-align: center;"
                    width="256"
                    :hide-details="true"
                    density="compact"
                    variant="outlined"
                  >
                    <template v-slot:append>
                      <v-btn
                        type="submit"
                        icon="mdi-check"
                        base-color="green"
                        density="compact"
                        variant="tonal"
                      />
                    </template>
                  </v-text-field>
                </form>

                <span 
                  v-else
                  @click="handleEditBinding(category, name)"
                  class="binding"
                >
                  <template 
                    v-for="(key, index) in bindingForPlatform(binding).split('+')"
                  >
                    <span 
                      v-if="index > 0" 
                      style="padding: 0 4px;"
                      v-text="'+'"
                    />
                    <v-kbd>{{ key }}</v-kbd>
                  </template>
                </span>

              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

    </p-dialog>
  `
}
