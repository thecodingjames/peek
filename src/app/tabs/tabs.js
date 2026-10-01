import HttpPage from '../http/http.page.js'

import TabsService from './tabs.service.js'
import HotkeysService from '../hotkeys/hotkeys.service.js'
import SettingsService from '../drawers/settings/settings.service.js'

import PopUpRename from './popups/popup-rename.js'
import PopUpContext from './popups/popup-context.js'

export default {
  components: {
    HttpPage,
    PopUpRename,
    PopUpContext,
  },

  data() {
    return {
      current: TabsService.current,
      tabs: TabsService.tabs,

      renaming: {
        visible: false,
        id: null,
        title: null,
        element: null,
      },

      context: {
        visible: false,
        id: null,
        title: null,
        element: null,
      },
    }
  },

  computed: {

    showTabs() {
      return SettingsService.ui.alwaysShowTabs || this.tabs.length > 1
    },

  },

  methods: {

    handleSelect(id) {
      TabsService.select(id)
    },

    titleEllipsis(title) {
      if (title == '' || title.length > 20) {
        return `${title.slice(0, 7)}...${title.slice(-7)}`
      } else {
        return title
      }
    },

    showPopup(tabId) {
      const tab = TabsService.get(tabId)

      const {id, title} = tab

      return {
        visible: true,

        element: event.currentTarget,
        id,
        title,
      }
    },

    handleRenamePopup(event, tabId) {
      this.renaming = this.showPopup(tabId)

      this.context.visible = false
    },

    handleContextMenu(event, tabId) {
      this.context = this.showPopup(tabId)

      this.renaming.visible = false
    },

    handleRename(name, source) {
      source.visible = false

      TabsService.rename(source.id, name)
    },

    handleClose(id) {
      TabsService.remove(id)
    },

  },

  mounted() {

    HotkeysService.set('tabs.new', () => {
      TabsService.new()
    })

    HotkeysService.set('tabs.close', () => {
      TabsService.remove(this.current)
    })

    HotkeysService.set('tabs.next', () => {
      TabsService.goNext()
    })

    HotkeysService.set('tabs.previous', () => {
      TabsService.goPrevious()
    })
  },

  template: `
    <div class="_tabs__tabs">
      <component is="style">
        ._tabs__tabs {

          height: 100%;
          display: flex;
          flex-direction: column;

          .v-window__container, .v-window-item {
            height: 100%;
          }

          .v-tabs {
            border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));

            .v-tab--selected {
              --opacity: calc(var(--v-activated-opacity) * var(--v-high-emphasis-opacity));
              background-color: color-mix(in srgb, currentColor calc(var(--opacity) * 100%), transparent);
            }
          }
        }

        .rename-card input {
          padding: 0 0.5rem;
        }
      </component>

      <v-tabs
        v-if="showTabs"
        show-arrows
        hide-slider

        :model-value="current"
        @update:model-value="handleSelect"

        class="nav_tabs"
        style="flex-shrink: 0;"
      >
        <v-tab
          v-for="item in tabs"
          :key="item.id"

          :text="titleEllipsis(item.title)"
          :value="item.id"

          @dblclick="handleRenamePopup($event, item.id)"
          @contextmenu.prevent="handleContextMenu($event, item.id)"
        >

          <template v-slot:append>
            <!-- stop propagation on dblclick on delete -->
            <v-btn
              v-if="tabs.length > 1"
              @click="handleClose(item.id)"
              @dblclick.stop=""

              color="error"
              size="x-small"
              variant="outlined"
              style="min-width: 0; aspect-ratio: 1;"
            >ㄨ</v-btn>
          </template>

        </v-tab>
      </v-tabs>

      <v-window
        v-model="current"
        style="padding: 1rem; flex-grow: 1;"
      >
        <v-tabs-window-item
          v-for="item in tabs"
          :key="item.id" 
          :value="item.id"
        >
          <http-page :tabId="item.id"/>
        </v-tabs-window-item>
      </v-window>

      <PopUpRename
        :context="renaming"

        @rename="handleRename($event, renaming)"
      />

      <PopUpContext
        :context="context"

        @rename="handleRename($event, context)"
      />

    </div>
  `
}
