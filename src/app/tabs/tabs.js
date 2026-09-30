import HttpPage from '../http/http.page.js'

import TabsService from './tabs.service.js'
import HotkeysService from '../hotkeys/hotkeys.service.js'
import SettingsService from '../drawers/settings/settings.service.js'

import { forceFocus } from '../core/helpers.js'

export default {
  components: {
    HttpPage
  },

  data() {
    return {
      current: TabsService.current,
      tabs: TabsService.tabs,

      renaming: null,
      showRenamingPopup: false,

      contextMenu: null,
      showContextMenu: false,
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

    handleRenamePopup(event, tabId) {
      const tab = TabsService.get(tabId)

      if (!tab) {
        // double clicked on X to delete
        return
      }

      const {id, title} = tab

      this.renaming = {
        element: event.currentTarget,
        id,
        title,
      }

      this.showRenamingPopup = true
      this.showContextMenu = false

      forceFocus( () => this.$refs.renameInput.controlRef )
    },

    handleRenameSubmit() {
      this.showRenamingPopup = false
      const { id, title } = this.renaming

      TabsService.rename(id, title)
    },

    handleClose(id) {
      TabsService.remove(id)
    },

    handleContextMenu(event, id) {
      this.contextMenu = {
        element: event.currentTarget,
        id,
      }

      this.showContextMenu = true
      this.showRenamingPopup = false
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

    this.$refs.renamePopup.animateClick = () => {
      this.renaming = null
    }
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
            <v-btn
              v-if="tabs.length > 1"
              @click.prevent="handleClose(item.id)"

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

      <v-menu
        ref="renamePopup"

        :model-value="showRenamingPopup"
        @update:model-value="showRenamingPopup = false"

        :target="renaming?.element"
        :close-on-content-click="false"
        location="bottom"
      >
        <v-card min-width="300" class="rename-card">
          <form
            @submit.prevent="handleRenameSubmit()"
            style="display: flex; align-items: center;"
          >
            <v-text-field
              ref="renameInput"

              :model-value="renaming?.title"
              @update:model-value="renaming ? (renaming.title = $event) : 'no-op'"

              placeholder="Title"

              :hide-details="true"
              density="comfortable"
              variant="plain"
              tile
            />

            <v-btn
              type="submit"
              icon="mdi-check"
              color="green"
              variant="tonal"
              density="compact"
              style="margin-right: 0.5rem;"
            />
          </form>
        </v-card>
      </v-menu>

      <v-menu
        ref="contextMenu"

        :model-value="showContextMenu"
        @update:model-value="showContextMenu = false"

        :target="contextMenu?.element"
        :close-on-content-click="false"
        location="bottom"
      >
        <v-card min-width="300" class="context-menu-card">
          <v-list>
            <v-list-item link>
              <v-list-item-title>Duplicate</v-list-item-title>
            </v-list-item>

            <v-list-item link>
              <v-list-item-title>Close</v-list-item-title>
            </v-list-item>

            <v-list-item link>
              <v-list-item-title>Close Others</v-list-item-title>
            </v-list-item>

            <v-list-item link>
              <v-list-item-title>Close All</v-list-item-title>
            </v-list-item>

            <v-list-subheader>Rename</v-list-subheader>

            <v-list-item>{{ contextMenu.id }}</v-list-item>

          </v-list>
          <!--
          <form
            @submit.prevent="handleRenameSubmit()"
            style="display: flex; align-items: center;"
          >
            <v-text-field
              ref="renameInput"

              :model-value="renaming?.title"
              @update:model-value="renaming ? (renaming.title = $event) : 'no-op'"

              placeholder="Title"

              :hide-details="true"
              density="comfortable"
              variant="plain"
              tile
            />

            <v-btn
              type="submit"
              icon="mdi-check"
              color="green"
              variant="tonal"
              density="compact"
              style="margin-right: 0.5rem;"
            />
          </form>
          -->
        </v-card>
      </v-menu>
    </div>
  `
}
