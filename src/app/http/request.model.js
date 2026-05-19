import VestModel from '../core/vest.model.js'
import t from '../translate/translate.service.js'

export default class Request extends VestModel {

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
    return Object.values(Request.Method)
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

  get text() {
    let text = ''

    const url = this.fullUrl
    const port = url.port ? `:${url.port}` : ''

    text += `${this.method} ${url.pathname ?? '???'}`
    text += '\n'
    text += `Host: ${url.hostname}${port}`

    return text
  }

  get fetchInit() {
    return {
      url: this.fullUrl.toString(),
      method: this.method, 
    }
  }

  constructor() {
    super()

    this.method = Request.Method.get
  }

  vestSuite() {
    return Vest.create( request => {
      const { test, enforce } = Vest

      test('method', `${t.request.model.validations.method}: ${Request.methods.join(', ')}`, () => {
        enforce(request.method).isValueOf(Request.Method);
      })

      test('url', t.request.model.validations.url, () => {
        enforce(request.url).isNotBlank();
      })

    })
  }

}


