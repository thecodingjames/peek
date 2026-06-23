import KeyValueModel from './key-value/key-value.model.js'

export default class HeadersModel extends KeyValueModel {

  text(boundary = null) {
    return Object.entries(this.forFetch(boundary)).reduce((text, [key, value]) => {
      return text + `${key}: ${value}\n`
    }, '')
  }

  forFetch(boundary = null) {
    const headers = this.actives.reduce( (result, header) => {
      return {
        ...result,
        [header.key]: header.value.content,
      }
    }, {})

    if (boundary) {
      const contentType = Object.keys(headers).find( h => h.toLowerCase() == 'content-type' )

      if (contentType) {
        headers[contentType] += `;boundary=${boundary}`
      }
    }

    return headers
  }

}
