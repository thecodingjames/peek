import { raw } from '../../core/helpers.js'
import { parseUrl } from '../url.helpers.js'

import VestModel from '../../core/vest.model.js'
import t from '../../translate/translate.service.js'

import QueryModel from './query.model.js'
import HeadersModel from './headers.model.js'
import BodyModel from './body.model.js'

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

  static createHeader() {
    return {
      id: crypto.randomUUID(),
      key: '',
      value: '',
      enabled: true,
    }
  }

  get parsedUrl() {
    return parseUrl(this._url)
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

    Object.entries(this.headersModel.forFetch).forEach(([key, value]) => {
      text += `${key}: ${value}\n`
    })

    return text
  }

  get fetchOptions() {
    return (async () => {

      const headers = this.headersModel.forFetch
      const body = await this.bodyModel.forFetch

      if (this.bodyModel.mode == 'form') {
        const contentType = Object.keys(headers).find( h => h.toLowerCase() == 'content-type' )

        if (contentType) {
          headers[contentType] += `;boundary=${body.split('\n')[0].trim().substring(2)}`
        }
      }

      return {
        url: this.parsedUrl?.toString() ?? '',
        method: this.method,
        headers,
        body,
      }
    })()
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

    // make sure no references to source object are kept
    props = raw(props)

    this.method = props.method ?? RequestModel.Method.get

    this._url = props.url ?? ''
    this.queryModel = new QueryModel(this._url, props.query)
    this.queryModel.onUrlChange = (url) => {
      this._url = url
    }

    this.headersModel = new HeadersModel(props.headers)

    this.bodyModel = new BodyModel(props.body)
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
          enforce.condition(url => !!parseUrl(url))
        )
      })

    })
  }

  toJSON() {
    return raw({
      url: this.url,
      query: this.query,
      method: this.method,
      headers: this.headers,
      body: this.bodyModel.toJSON(),
    })
  }

}
