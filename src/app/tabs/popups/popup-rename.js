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

  template: `
    <Popup :context >
      <RenameForm
        :title="context.title"

        @submit="handleRename"
      />
    </Popup>
  `
}
