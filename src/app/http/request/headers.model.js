import KeyValueModel from './details/key-value.model.js'

export default class HeadersModel extends KeyValueModel {

  get forFetch() {
    return this.actives.reduce( (result, header) => {
      return {
        ...result,
        [header.key]: header.value,
      }
    }, {})
  }

}

