export default {

  props: [
    'title',
  ],

  template: `
    <div style="padding: 1rem; padding-top: 4px;">

      <h1 style="margin-top: 0;">{{ title }}</h1>

      <slot></slot>

    </div>
  `
}
