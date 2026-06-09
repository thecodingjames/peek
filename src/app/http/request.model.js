import VestModel from '../core/vest.model.js'
import t from '../translate/translate.service.js'

class KeyValuesModel {

  static create(key = '', value = '') {
    return {
      id: crypto.randomUUID(),
      key,
      value,
      enabled: true,
    }
  }

  static ignored(pair) {
    return !pair?.enabled || pair?.key?.trim() == ''
  }

  constructor(pairs) {
    this.pairs = pairs ?? []
  }

  new() {
    this.pairs.push(
      KeyValuesModel.create()
    )
  }

  remove(id) {
    this.pairs = this.pairs.filter(p => p.id != id)
  }

  sort(oldIndex, newIndex) {
    const moved = this.pairs.splice(oldIndex, 1)[0]
    this.pairs.splice(newIndex, 0, moved)
  }

}

class QueryModel extends KeyValuesModel {

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
    const newParams = this.pairs
      .filter( p => !KeyValuesModel.ignored(p) )
      .map( ({ id, key, value }, index) => {
        const matchingParams = this.pairs.filter( p => p.key == key )
        const keyExpression = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const matchingParamsInUrl = this.url?.matchAll(`${keyExpression}(=|&|$){1}`).toArray() ?? []

        const matchingIndex = matchingParams.findIndex( p => p.id == id )
        const equal = (matchingParamsInUrl[matchingIndex]?.at(-1) == '=' || value != '') ? '=' : ''

        return `${key}${equal}${value}`
      })

    const prefix = newParams.length > 0 ? '?' : ''

    if (RequestModel.parseUrl(this.url)) {
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
    newUrl = newUrl ?? this.url

    const newUrlParams = RequestModel.parseUrl(newUrl)?.searchParams ?? new URLSearchParams()

    this.url = newUrl

    const merged = []

    newUrlParams.entries().forEach( ([key, value], index) => {
      let cursor = this.pairs[0] ?? { }

      while(this.pairs.length > 0 && KeyValuesModel.ignored(cursor)) {
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
        merged.push(KeyValuesModel.create(key, value))
      }
    })

    const remainingDisabled = this.pairs.filter( q => KeyValuesModel.ignored(q))
    this.pairs = [...merged, ...remainingDisabled]
  }
}

export default class RequestModel extends VestModel {

  static get Method() {
    return {
      get:     'GET',
      post:    'POST',
      put:     'PUT',
      patch:   'PATCH',
      delete:  'DELETE',
      options: 'OPTIONS',
      head:    'HEAD',
    }
  }

  static get methods() {
    return Object.values(RequestModel.Method)
  }

  static parseUrl(url) {
    if (! url?.match(/^https?:\/\/.+/) ) {
      url = `http://${url}`
    }

    try {
      return new URL(url)
    } catch {
      return null
    }
  }

  static createHeader() {
    return {
      id: crypto.randomUUID(),
      key: '',
      value: '',
      enabled: true,
    }
  }

  get parsedUrl() {
    return RequestModel.parseUrl(this._url)
  }

  get host() {
    const { port, hostname } = this.parsedUrl ?? {
      hostname: `{ ${t.request.model.invalidHost}  }`,
    }

    return `${hostname}${port ? `:${port}` : ''}`
  }

  get path() {
    return this.parsedUrl?.pathname ?? `{ ${t.request.model.invalidPath} }`
  }

  get text() {
    const params = this.parsedUrl?.searchParams ?? new URLSearchParams()
    let text = ''

    text += `${this.method} ${this.path}${params.size > 0 ? '?'+params.toString() : ''}`
    text += '\n'
    text += `host: ${this.host}\n`

    Object.entries(this.fetchHeaders).forEach(([key, value]) => {
      text += `${key}: ${value}\n`
    })

    return text
  }

  get fetchHeaders() {
    return this.headers.reduce( (result, header) => {
      if (!KeyValuesModel.ignored(header)) {
        return {
          ...result,
          [header.key]: header.value,
        }
      } else {
        return result
      }
    }, {})
  }

  get fetchOptions() {
    const headers = this.fetchHeaders

    return {
      url: this.parsedUrl?.toString() ?? '',
      method: this.method,
      headers,
    }
  }

  get url() {
    return this._url
  }

  set url(value) {
    this._url = value

    this.queryModel.mergeFromUrl(this._url)
  }

  get query() {
    return this.queryModel.pairs
  }

  get headers() {
    return this.headersModel.pairs
  }

  constructor(props = {}) {
    super()

    this._url = props.url ?? ''

    this.method = props.method ?? RequestModel.Method.get

    this.queryModel = new QueryModel(this._url, props.query)

    this.headersModel = new KeyValuesModel(props.headers)
  }

  addHeader() {
    this.headersModel.new()
  }

  removeHeader(id) {
    this.headersModel.remove(id)
  }

  sortHeaders(oldIndex, newIndex) {
    this.headersModel.sort(oldIndex, newIndex)
  }

  addQuery() {
    this.queryModel.new()
  }

  removeQuery(id) {
    this._url = this.queryModel.remove(id)
  }

  sortQuery(oldIndex, newIndex) {
    this._url = this.queryModel.sort(oldIndex, newIndex)
  }

  applyQuery() {
    this._url = this.queryModel.applyToUrl()
  }

  vestSuite() {
    return Vest.create( request => {
      const { test, enforce } = Vest

      test('method', `${t.request.model.validations.method}: ${RequestModel.methods.join(', ')}`, () => {
        enforce(request.method).isValueOf(RequestModel.Method);
      })

      test('url', t.request.model.validations.url, () => {
        enforce(request.url).allOf(
          enforce.isNotBlank(),
          enforce.condition(url => !!RequestModel.parseUrl(url))
        )
      })

    })
  }

  toJSON() {
    return {
      url: this.url,
      method: this.method, 
      headers: this.headers,
      query: this.query,
    }
  }

}


