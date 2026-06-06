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

  static createQuery(key = '', value = '') {
    return {
      id: crypto.randomUUID(),
      key,
      value,
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
    const params = this.fullUrl.searchParams
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
    return this.headers.reduce( (result, { key, value, enabled }) => {
      if (enabled && key.trim() != '') {
        return {
          ...result,
          [key]: value,
        }
      } else {
        return result
      }
    }, {})
  }

  get fetchOptions() {
    const headers = this.fetchHeaders

    return {
      url: this.url ? this.fullUrl.toString() : '',
      method: this.method,
      headers,
    }
  }

  get url() {
    return this._url
  }

  set url(value) {
    this._url = value

    const merged = []

    this.fullUrl.searchParams?.entries().forEach( ([key, value], index) => {
      const cursor = this.query[0] ?? { }

      if(cursor.key == key) {
        this.query.slice(0, 1)[0]

        merged.push({
          ...cursor,
          value,
        })
      } else {
        merged.push(RequestModel.createQuery(key, value))
      }
    })

    // TODO make sure to keep disabled items
    const remainingDisabled = this.query.filter( q => !q.enabled )
    this.query = [...merged, ...remainingDisabled]
  }

  constructor(props) {
    super()

    this._url = ''
    this.method = RequestModel.Method.get

    this.query = []

    this.headers = []

    Object.assign(this, props)
  }

  addHeader() {
    this.headers.push(
      RequestModel.createHeader()
    )
  }

  removeHeader(id) {
    this.headers = this.headers.filter(m => m.id != id)
  }

  addQuery() {
    this.query.push(
      RequestModel.createQuery()
    )
  }

  removeQuery(id) {
    this.query = this.query.filter(q => q.id != id)
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


