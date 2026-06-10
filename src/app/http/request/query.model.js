import { parseUrl } from '../url.helpers.js'

import KeyValueModel from './details/key-value.model.js'

export default class QueryModel extends KeyValueModel {

  constructor(url, params) {
    super(params)

    this.url = url
    this.mergeFromUrl()
  }

  new() {
    super.new()

    this.mergeFromUrl()
  }

  remove(id) {
    super.remove(id)

    return this.applyToUrl()
  }

  sort(oldIndex, newIndex) {
    super.sort(oldIndex, newIndex)

    return this.applyToUrl()
  }

  applyToUrl() {
    const newParams = this.actives.map( ({ id, key, value }, index) => {
      const matchingParams = this.pairs.filter( p => p.key == key )
      const keyExpression = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const matchingParamsInUrl = this.url?.matchAll(`${keyExpression}(=|&|$){1}`).toArray() ?? []

      const matchingIndex = matchingParams.findIndex( p => p.id == id )
      const equal = (matchingParamsInUrl[matchingIndex]?.at(-1) == '=' || value != '') ? '=' : ''

      return `${key}${equal}${value}`
    })

    const prefix = newParams.length > 0 ? '?' : ''

    if (parseUrl(this.url)) {
      const paramsRegExp = /\?.*$/
      const paramsValue = `${prefix}${newParams.join('&')}`

      if (this.url?.match(paramsRegExp)) {
        this.url = this.url?.replace(paramsRegExp, paramsValue)
      } else {
        this.url += paramsValue
      }
    }

    return this.url
  }

  mergeFromUrl(newUrl) {
    this.url = newUrl ?? this.url

    const newUrlParams = parseUrl(this.url)?.searchParams ?? new URLSearchParams()
    const merged = []

    newUrlParams.entries().forEach( ([key, value], index) => {
      let cursor = this.pairs[0] ?? { }

      while(this.pairs.length > 0 && KeyValueModel.ignored(cursor)) {
        const saved = this.pairs.splice(0, 1)[0]
        merged.push(saved)

        cursor = this.pairs[0] ?? { }
      }

      if(cursor.key == key) {
        this.pairs.splice(0, 1)[0]

        merged.push({
          ...cursor,
          value,
        })
      } else {
        merged.push(KeyValueModel.create(key, value))
      }
    })

    const remainingDisabled = this.pairs.filter( q => KeyValueModel.ignored(q))
    this.pairs = [...merged, ...remainingDisabled]
  }

}

