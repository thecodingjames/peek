export default {
  props: [
    'detail',
    'visible',

    'mode', // ref received from parent
  ],

  emits: [
    'create',
    'toggle:mode',
  ],

  computed: {
    
    create() {
      return this.detail.create?.value ?? true
    },

    modes() {
      return this.detail.modes
    },

    badgeColor() {
      return this.detail.active.value ? 'primary' : 'transparent'
    },

  },

  methods: {
    handleToggle() {
      const currentMode = this.modes.findIndex( mode => mode == this.mode.value) 
      const newIndex = (currentMode + 1) % this.modes.length

      this.$emit('toggle:mode', this.modes[newIndex])
    }
  },

  template: `
    <v-badge
      :color="badgeColor"
      :dot="true"

      tag="span"
      floating
      location="top right"
      style="margin-right: 1rem; text-transform: uppercase; font-size: 0.7rem; font-weight: bold; letter-spacing: 0.01rem;"
    >
      {{ t.request.details[detail.name].name }}
    </v-badge>

    <span>
      <v-btn
        v-if="!!modes"

        @click.stop="handleToggle"

        size="x-small"
        variant="outlined"
        style="margin-right: 1rem; min-width: 0; aspect-ratio: 1;"
      >
      ⇄
      </v-btn>

      <v-btn
        @click.stop="$emit('create')"

        color="success"
        size="x-small"
        variant="outlined"
        :style="{ visibility: (create ? 'visible' : 'hidden') }"
        style="min-width: 0; aspect-ratio: 1; border-radius: 99px; font-size: 1rem; line-height: 19px;"
      >+</v-btn>
    </span>
  `
}
