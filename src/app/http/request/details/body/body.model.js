import KeyValueModel from './../key-value/key-value.model.js'

export default class BodyModel extends KeyValueModel {

  static get defaults() {
    return {
      mode: { name: BodyModel.Modes[0], encoding: 'urlencoded' },
      raw: '',
    }
  }

  static get Modes() {
    return ['raw', 'keyValue']
  }

  get isKeyValue() {
    return this.mode.name == 'keyValue'
  }

  get actives() {
    return super.actives.filter( p => {
      if (p.value.mode == 'file') {
        return this.mode.encoding == 'multipart'
      } else {
        return true
      }
    })
  }

  get active() {
    if (this.isKeyValue) {
      return this.actives.length > 0
    } else {
      return this.raw.length > 0
    }
  }

  get forFetch() {
    return (async () => {
      if (this.active) {
        const body = await ({
          raw: () => {
            return this.raw
          },

          keyValue: async () => {
            const actives = this.actives

            return await {
              urlencoded: async () => {
                const data = actives.reduce( (data, {key, value}) => {
                  data.append(key, value.content)
                  return data
                }, new URLSearchParams())

                return data.toString()
              },

              multipart: async () => {
                const form = actives.reduce( (formData, {key, value}) => {
                  let content = null

                  if (value.mode == 'file' && value.content) {
                    content = new File([value.content], value.filename, { type: value.type })
                  } else {
                    content = value.content ?? ''
                  }

                  formData.append(key, content)

                  return formData
                }, new FormData())

                return (await new Response(form).text()).trim()
              },
            }[this.mode.encoding]()
          },
        }[this.mode.name])()

        let boundary = null
        if (this.mode.encoding == 'multipart') {
          boundary = body.split('\n')[0]?.trim()?.substring(2)
        }

        return {
          body,
          boundary,
        }
      } else {
        return { body: null }
      }
    })()
  }

  constructor(props = {}) {
    super(props.pairs)

    props = {
      ...BodyModel.defaults,
      ...props,
    }

    this.mode = props.mode
    this.raw = props.raw
  }

  clear() {
    super.clear()

    this.mode = BodyModel.defaults.mode
    this.raw = BodyModel.defaults.raw
  }

  toJSON() {
    return {
      mode: this.mode,
      raw: this.raw,
      pairs: super.toJSON(),
    }
  }

}
