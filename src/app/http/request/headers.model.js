import KeyValueModel from './details/key-value.model.js'

export default class HeadersModel extends KeyValueModel {

  get forFetch() {
    return this.pairs.reduce( (result, header) => {
      if (!KeyValueModel.ignored(header)) {
        return {
          ...result,
          [header.key]: header.value,
        }
      } else {
        return result
      }
    }, {})
  }

}

