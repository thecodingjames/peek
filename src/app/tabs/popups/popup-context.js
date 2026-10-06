import Popup, { mixin } from './popup.js'
import RenameForm from './rename-form.js'

export default {
  mixins: [
    mixin,
  ],

  components: {
    Popup,
    RenameForm,
  },

  props: [
    'actions',
  ],

  emits: [
    'click',
  ],

  methods: {

    handleAction(action) {
      this.$emit('click', { action, tabId: this.source.id })
    },

  },

  template: `
      <Popup :source @hide="handleHide()">
        <div class="_tabs_popup_context_popup">
          <component is="style">
            ._tabs_popup_context_popup { 

              .v-list {
                padding-top: 0;
                padding-bottom: 0.75rem;
              }

              .v-list-item {
                padding: 0 0.5rem;
              }

              .v-list-item-title {
                font-size: 0.9rem !important;
              }

              ._tabs_popup_rename-form {

                align-items: end !important;
                
                input, button {
                  margin: 0 !important;
                }

                input {
                  padding-top: 1rem;
                }

                .v-input {
                  margin-right: 0.5rem;
                }
              }
            }
          </component>

          <v-list>

            <v-list-item 
              v-for="(active, action) in actions"

              :disabled="!active"

              @click="handleAction(action)"
              link
            >
              <v-list-item-title>{{ t.tabs.context[action] }}</v-list-item-title>
            </v-list-item>

            <v-list-item style="padding-top: 0.5rem;">
              <RenameForm
                :title="source.title"

                variant="underlined"
                :autofocus="false"

                @submit="handleRename"
              />
            </v-list-item>

          </v-list>
        </div>
      </Popup>
  `
}
