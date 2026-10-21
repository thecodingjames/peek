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
      this.$emit('click', { action, tabId: this.source.id })
    },

  },

  template: `
    <PopupList
      :source

      :actions="actions"
      :translate="t.request.actions"

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
  `
}
