import History from './history/history.js'
import Settings from './settings/settings.js'
import HotkeysDialog from '../hotkeys/hotkeys-dialog.js'

import TabsService from '../tabs/tabs.service.js'
import HotkeysService from '../hotkeys/hotkeys.service.js'
import SettingsService from './settings/settings.service.js'

export default {
  components: {
    History,
    Settings,
    HotkeysDialog,
  },

  data() {
    return {
      current: undefined,

      hotkeysDialogOpened: false,

      width: SettingsService.ui.drawerWidth,
      origin: null,
    }
  },

  computed: {
    options() {
      return {
        history: {
          component: History,
          icon: 'mdi-history',
        },
        settings: {
          component: Settings,
          icon: 'mdi-cog',
        },
      }
    },

    drawer() {
      return this.options[this.current]?.component
    },

  },

  methods: {

    handleNewRequest(event) {
      TabsService.new()
    },

    handleDrawerItem(name) {
      if (name == this.current) {
        this.current = undefined
      } else {
        this.current = name
      }
    },

    handleHotkeysClick() {
      this.hotkeysDialogOpened = true
    },

    handleMouseDown(e) {
      this.origin = {
        width: this.width,
        x: e.clientX,
      }
    },

    handleMouseUp() {
      this.origin = null
    },

    handleMouseMove(e) {
      if (this.origin) {
        const currentX = e.clientX
        const newWidth = this.origin.width + (currentX - this.origin.x) 

        const min = 256
        const max = document.body.getBoundingClientRect().width * 0.5

        this.width = Math.min(Math.max(min, newWidth), max)
      }
    },

  },

  watch: {
    
    width(value) {
      SettingsService.ui.drawerWidth = value
    },

    origin(value) {
      document.querySelector('.v-application').classList.toggle('resizing', !!value)
    },

  },

  mounted() {

    HotkeysService.set('nav.history', () => {
      this.handleDrawerItem('history')
    })

    HotkeysService.set('nav.settings', () => {
      this.handleDrawerItem('settings')
    })

    HotkeysService.set('nav.hotkeys', () => {
      this.hotkeysDialogOpened = !this.hotkeysDialogOpened
    })

    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)

  },

  beforeUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
  },

  template: `
    <div>
      <component is="style">
        .resizing {
          * {
            cursor: col-resize !important;
          }

          .v-navigation-drawer, .v-main {
            transition: none !important;
          }

          .resize-handle:hover,.resize-handle:hover * {
            cursor: col-resize !important;
          }
        }

        .resize-handle:hover,.resize-handle:hover * {
          cursor: grab !important;
        }

        .resize-handle {
          flex-shrink: 1;
          height: 100%;
          background-color: rgba(var(--v-border-color), var(--v-border-opacity));
;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

      </component>

      <v-navigation-drawer
        :rail="true"
        permanent
      >
        <v-list nav>
          <v-list-item
            @click="handleNewRequest" 
            prepend-icon="mdi-plus"
            value="new"
            :active="false"
            v-tooltip="{text: t.drawers.newRequest.title, openDelay: 1000}"
          />

          <v-list-item
            v-for="(option, name) in options"

            @click="handleDrawerItem(name)" 
            :active="current == name"
            :prepend-icon="option.icon"
            :title="t.drawers[name].title"
            :value="name"
            v-tooltip="{text: t.drawers[name].title, openDelay: 1000}"
          />
        </v-list>
      </v-navigation-drawer>

      <v-navigation-drawer 
        :permanent="!!drawer"
        :mobile="true"
        :width
      >
        <div 
          v-if="!!drawer"
          style="height: 100%; display: flex; flex-direction: row;"
        >
          <div style="flex-grow: 1;">
            <h1 style="margin: 4px 1rem;">{{ t.drawers[current].title }}</h1>

            <div style="flex-grow: 1; overflow-y: auto;">
              <component 
                :is="drawer"
                @hotkeysClick="handleHotkeysClick()"
                style="overflow-y: auto; flex-grow: 1;"
              />

            </div>
          </div>

          <div 
            ref="resizeHandle"
            class="resize-handle"

            @mousedown="handleMouseDown"
          >
            <v-icon
              icon="mdi-drag-vertical-variant"
              size="x-small"
            />
          </div>
        </div>
      </v-navigation-drawer>

      <hotkeys-dialog v-model="hotkeysDialogOpened" />
    </div>
  `
}
