import KeyValueModel from './details/key-value.model.js'

export default class BodyModel extends KeyValueModel {

  static get Modes() {
    return ['raw', 'form']
  }

  get active() {
    return {
      raw: this.raw.trim() != '',
      form: this.actives.length > 0,
    }[this.mode]
  }

  constructor(props = {}) {
    super(props.pairs)

    this.mode = BodyModel.Modes[0]

    this.raw = ''
  }

}
