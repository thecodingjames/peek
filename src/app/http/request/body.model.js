import KeyValueModel from './details/key-value.model.js'

export default class BodyModel extends KeyValueModel {

  static get Modes() {
    return ['raw', 'form']
  }

  get active() {
    return {
      raw: this.raw.length > 0,
      form: this.actives.length > 0,
    }[this.mode]
  }

  get forFetch() {
    return (async () => {
      const body = await ({
        raw: () => {
          return this.raw
        },

        form: async () => {
          const actives = this.actives

          if (actives.length == 0) {
            return ''
          }

          const form = actives.reduce( (formData, {key, value}) => {
            formData.append(key, value)
            return formData
          }, new FormData())

          return (await new Response(form).text()).trim()
        },
      }[this.mode])()

      let boundary = null
      if (this.mode == 'form') {
        boundary = body.split('\n')[0]?.trim()?.substring(2)
      }

      return {
        body,
        boundary,
      }
    })()
  }

  constructor(props = {}) {
    super(props.form)

    this.mode = props.mode ?? BodyModel.Modes[0]

    this.raw = props.raw ?? ''
  }

  toJSON() {
    return {
      mode: this.mode,
      raw: this.raw,
      form: this.pairs,
    }
  }

}
