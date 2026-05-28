import History from './history/history.js'
import Settings from './settings/settings.js'
import HotkeysDialog from '../hotkeys/hotkeys-dialog.js'

import TabsService from '../tabs/tabs.service.js'
import HotkeysService from '../hotkeys/hotkeys.service.js'

export default {
  components: {
    History,
    Settings,
    HotkeysDialog,
  },

  mounted() {

    HotkeysService.set('nav.history', () => {
      this.handleDrawerItem('history')
    })

    HotkeysService.set('nav.settings', () => {
      this.handleDrawerItem('settings')
    })

    HotkeysService.set('nav.hotkeys', () => {
      this.hotkeysDialogOpened = true
    })

  },

  data() {
    return {
      current: undefined,

      hotkeysDialogOpened: false,

      width: 256,
      originX: null,
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
      this.originX = e.clientX
    },

    handleMouseUp() {
      this.originX = null
    },

    handleMouseMove(e) {
      if (this.originX) {
        const currentX = e.clientX
        console.log({currentX})

        this.width = this.originX + (currentX - this.originX)
      }
    },

  },

  mounted() {
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
        .resize-handle {
          flex-shrink: 1;
          width: 4px;
          height: 100%;
          background-color: gray;
        }

        .resize-handle:hover {
          cursor: col-resize;
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
          style="height: 100dvh; display: flex; flex-direction: row;"
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
          ></div>
        </div>
      </v-navigation-drawer>

      <hotkeys-dialog v-model="hotkeysDialogOpened" />
    </div>
  `
}
