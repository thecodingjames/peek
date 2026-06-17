import { forceFocus } from '../../../core/helpers.js'

const ValueDialog = {
  props: [
    'item',
  ],

  emits: [
    'close',
  ],

  data() {
    return {
      value: null,
    }
  },

  watch: {
    item(newItem) {
      if (newItem) {
        this.value = newItem.value
      }
    },
  },

  methods: {
    handleClose(save) {
      if (save) {
        this.item.value = this.value
      }

      this.$emit('close')
    },
  },

  template: `
    <v-dialog
      :model-value="!!item"
      @update:model-value="handleClose(false)"

      max-width="500"
    >
      <template v-slot>
        <v-card title="Dialog">
          <v-card-text>
            <v-textarea 
              v-model="value"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              @click="handleClose(true)"
              text="Save"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  `
}

export default {

  components: {
    ValueDialog,
  },

  emits: [
    'create',
    'edit',
    'sort',
    'delete',
  ],

  props: [
    'items',
    'altInputs',

    'disabled',
  ],

  data() {
    return {
      focusIndex: null,

      dialogItem: null,
    }
  },

  computed: {

    inputs() {
      return [
        {
          name: 'raw',
          tag: 'v-text-field',
          default: '',
        },
        ...(this.altInputs ?? []),
      ]
    },

  },

  methods: {

    handleCreate(index) {
      this.focusIndex = index + 1

      this.$emit('create', index)
    },

    handleEdit() {
      this.$emit('edit')
    },

    handleSort({oldIndex, newIndex}) {
      this.$emit('sort', oldIndex, newIndex)
    },

    handleDelete(id) {
      this.$emit('delete', id)
    },

    inputIndex(item) {
      return this.inputs.findIndex( input => input.name == item.mode )
    },

    inputNextIndex(item) {
      const index = this.inputIndex(item)

      return (index + 1) % this.inputs.length
    },

    input(item) {
      return this.inputs.find( i => i.name == item.mode )
    },

    nextIcon(item) {
      return this.inputs[this.inputNextIndex(item)].icon ?? 'mdi-text-short'
    },

    handleToggleInputs(item) {
      item.mode = this.inputs[this.inputNextIndex(item)].name

      this.handleClear(item)
    },

    handleClear(item) {
      item.value = this.input(item).default
    },

    handleOpenValueDialog(item) {
      this.dialogItem = item
    },

  },

  watch: {

    items(items) {
      if (this.focusIndex) {
        const index = this.focusIndex
        this.focusIndex = null

        forceFocus(() => this.$refs.items.children[index]?.querySelector('input[type=text]'))
      }
    }

  },

  mounted() {
    this.sortable = Sortable.create(this.$refs.items, {
      handle: '.sort-handle',
      direction: 'vertical',
      scroll: true,

      onEnd: this.handleSort,
    })
  },

  beforeUnmount() {
    this.sortable?.destroy()
  },

  template: `

    <value-dialog :item="dialogItem" @close="dialogItem = null" />

    <div
      v-show="items.length > 0"
    >

      <slot name="prepend" />

      <v-table
        class="_http_request-details_editable-key-value"
      >
        <component is="style">
          ._http_request-details_editable-key-value {
            .sort-handle:hover {
              cursor: move;
            }

            tr[disabled=true] .can-disable>* {
              opacity: 30%;
            }

            td {
              padding: 0.5rem;
            }

            td.min-width {
              width: 1%;
            }

            .sortable-chosen {
              background-color: color-mix(in srgb, lightgray 20%, transparent);
            }

            .sortable-drag {
              background-color: color-mix(in srgb, currentColor 20%, transparent);
            }

            .sortable-drag *:first-child {
              opacity: 80%;
            }

            .sortable-ghost * {
              opacity: 0 !important;
            }
          }
        </component>

        <tbody ref="items">
          <tr
            v-for="(item, index) in items"
            :key="item.id"

            :disabled="!item.enabled || item.key.trim() == ''"
          >
            <td class="min-width">
              <v-icon
                :disabled="items.length <= 1"
                icon="mdi-drag-vertical"
                class="sort-handle"
              />
            </td>

            <td class="min-width">
              <v-checkbox
                v-model="item.enabled"
                @update:modelValue="handleEdit"
                hide-details

                style="width: 16px; margin-left: -8px; margin-right: 16px;"
              />
            </td>

            <td>
              <v-form
                @submit.prevent="handleCreate(index)"
                style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;"
              >
                <v-text-field
                  v-model="item.key"
                  @update:modelValue="handleEdit"

                  density="compact"
                  hide-details

                  class="can-disable"
                />

                <div style="display: flex; gap: 0.25rem;">
                  <component
                    :is="input(item).tag"

                    v-model="item.value"
                    @update:modelValue="handleEdit"
                    @click:clear="handleClear(item)"

                    :label="input(item).label"
                    :prepend-inner-icon="input(item).icon"

                    prepend-icon=""
                    single-line
                    density="compact"
                    hide-details

                    class="can-disable"
                  >
                    <template
                      v-if="item.mode == 'raw'"
                      v-slot:prepend-inner>
                      <v-btn
                        @click="handleOpenValueDialog(item)"
                        style="margin-left: -0.75rem; aspect-ratio: 1; min-width: 0;"
                        variant="text"
                      >
                        <v-icon icon="mdi-arrow-expand" />
                      </v-btn>
                    </template>
                  </component>
                  <v-btn
                    v-if="altInputs"
                    @click="handleToggleInputs(item)"

                    style="height: 100%; padding: 0; min-width: 0; aspect-ratio: 1;"
                  >
                    <v-icon :icon="nextIcon(item)" />
                  </v-btn>

                </div>

                <button style="display: none;">never shown, needed to allow Enter to trigger</button>
              </v-form>
            </td>

            <td class="min-width">
              <v-btn
                @click.stop="handleDelete(item.id)"

                color="red"
                size="x-small"
                variant="outlined"
                style="min-width: 0; aspect-ratio: 1;"
              >
              ㄨ
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div
      v-show="items.length == 0"
      style="margin-left: 1.5rem; padding: 0.5rem 0; font-style: italic;"
    >
      <span>{{ t.request.details.keyValue.empty }}</span>
    </div>
  `
}
