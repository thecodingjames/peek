import VestModel from '../core/vest.model.js'
import t from '../translate/translate.service.js'

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

  get fullUrl() {
    let url = this.url ?? ''

    if (! url.match(/^https?:\/\/.+/) ) {
      url = `http://${url}`
    }

    try {
      return new URL(url)
    } catch {
      return {
        pathname: `{ ${t.request.model.invalidPath} }`,
        hostname: `{ ${t.request.model.invalidHost}  }`,
      }
    }
  }

  get host() {
    const url = this.fullUrl

    const port = url.port ? `:${url.port}` : ''

    return `${url.hostname}${port}`
  }

  get path() {
    return `${this.fullUrl.pathname ?? '???'}`
  }

  get text() {
    let text = ''

    text += `${this.method} ${this.path}`
    text += '\n'
    text += `Host: ${this.host}`

    return text
  }

  get fetchOptions() {
    const headers = this.headers.reduce( (result, { key, value, enabled }) => {
      if (enabled && key.trim() != '' && value.trim() != '') {
        return {
          ...result,
          [key]: value,
        }
      } else {
        return result
      }
    }, {})

    return {
      url: this.url ? this.fullUrl.toString() : '',
      method: this.method,
      headers,
    }
  }

  constructor(props) {
    super()

    this.url = ''
    this.method = RequestModel.Method.get
    this.query = [
      {
        _id: '',
        key: '',
        value: '',
        enabled: true,
      }
    ]

    this.headers = [
      RequestModel.createHeader()
    ]

    Object.assign(this, props)
  }

  vestSuite() {
    return Vest.create( request => {
      const { test, enforce } = Vest

      test('method', `${t.request.model.validations.method}: ${RequestModel.methods.join(', ')}`, () => {
        enforce(request.method).isValueOf(RequestModel.Method);
      })

      test('url', t.request.model.validations.url, () => {
        enforce(request.url).isNotBlank();
      })

    })
  }

  toJSON() {
    return {
      url: this.url ? this.fullUrl.toString() : '',
      method: this.method, 
      headers: this.headers,
      query: this.query,
    }
  }

}


