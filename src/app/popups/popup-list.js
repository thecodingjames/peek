import Popup, { mixin } from './popup.js'

export default {
  mixins: [
    mixin,
  ],

  components: {
    Popup,
  },

  props: [
    'actions',
    'translate',
  ],

  emits: [
    'click',
  ],

  methods: {

    handleAction(action) {
      this.$emit('click', { action })
    },

  },

  template: `
      <Popup :source @hide="handleHide()">
        <div class="_popups_list">
          <component is="style">
            ._popups_list {

              .v-list {
                padding-top: 0;
                padding-bottom: {{ $slots.default ? '0.75rem' : 0 }};
              }

              .v-list-item {
                padding: 0 0.5rem;
              }

              .v-list-item-title {
                font-size: 0.9rem !important;
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
              <v-list-item-title>{{ translate[action] }}</v-list-item-title>
            </v-list-item>

            <slot></slot>

          </v-list>
        </div>
      </Popup>
  `
}
