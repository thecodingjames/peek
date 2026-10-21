import Popup, { mixin } from '../../popups/popup.js'
import tabMixin from './popup.mixin.js'
import RenameForm from './rename-form.js'

export default {
  mixins: [
    mixin,
    tabMixin,
  ],

  components: {
    Popup,
    RenameForm,
  },

  template: `
      <Popup :source @hide="handleHide()">
        <div class="_tabs_popup_rename_popup">
          <component is="style">
            ._tabs_popup_rename_popup ._tabs_popup_rename-form {
              
              input {
                margin: 0 0.5rem;
              }

            }
          </component>

          <RenameForm
            :title="source.title"
            :autofocus="true"

            @submit="handleRename"
          />
        </div>
      </Popup>
  `
}
