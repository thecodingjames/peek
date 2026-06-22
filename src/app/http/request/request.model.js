import { raw } from '../../core/helpers.js'
import { parseUrl } from '../url.helpers.js'

import VestModel from '../../core/vest.model.js'
import t from '../../translate/translate.service.js'

import QueryModel from './details/query.model.js'
import HeadersModel from './details/headers.model.js'
import BodyModel from './details/body/body.model.js'

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
      hostname: `{ ${t.request.model.invalidHost} }`,
    }

    return `${hostname}${port ? `:${port}` : ''}`
  }

  get path() {
    return this.parsedUrl?.pathname ?? `{ ${t.request.model.invalidPath} }`
  }

  get preventBody() {
    return ['GET', 'HEAD'].includes(this.method)
  }

  get text() {
    return ( async () => {
      const { body, boundary } = await this.bodyModel.forFetch

      let text = ''

      text += `${this.method} ${this.path}${this.queryModel.text}`
      text += '\n'

      text += `host: ${this.host}\n`
      text += this.headersModel.text(boundary)

      if (this.preventBody) {
        text += '\n'
        text += `{ ${t.request.model.preventBody} }`
      } else if (body?.length > 0) {
        text += '\n'
        text += body
      }

      return text
    })()
  }

  get fetchOptions() {
    return (async () => {
      const { body, boundary } = await this.bodyModel.forFetch
      const headers = this.headersModel.forFetch(boundary)

      return {
        url: this.parsedUrl?.toString() ?? '',
        method: this.method,
        headers,
        body: this.preventBody ? null : body,
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
      query: this.queryModel.toJSON(),
      method: this.method,
      headers: this.headersModel.toJSON(),
      body: this.bodyModel.toJSON(),
    })
  }

}
