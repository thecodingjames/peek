import PopupList, { listMixin } from '../../popups/popup-list.js'
import tabMixin from './popup.mixin.js'
import RenameForm from './rename-form.js'

export default {
  mixins: [
    listMixin,
    tabMixin,
  ],

  components: {
    PopupList,
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
      this.$emit('click', { ...action, tabId: this.source.id })
    },

  },

  template: `
    <div>
      <component is="style">
        ._popups_list {

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

      <PopupList
        :source

        :actions="actions"
        :translate="t.tabs.context"

        @click="handleAction($event)"

        @hide="handleHide()"
      >
        <v-list-item style="padding-top: 0.5rem;">
          <RenameForm
            :title="source.title"

            variant="underlined"
            :autofocus="false"

            @submit="handleRename"
          />
        </v-list-item>
      </PopupList>
    </div>
  `
}
