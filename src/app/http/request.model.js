import VestModel from '../core/vest.model.js'

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

  get text() {
    let text = ''

    const url = new URL(this.url)

    text += `${this.method} ${url.pathname ?? '???'}`

    text += `Host: ${url.hostname}`

    return text
  }

  constructor() {
    super()

    this.method = Request.Method.get
  }

  vestSuite() {
    return Vest.create( request => {
      const { test, enforce } = Vest

      test('method', `Method must be one of: ${Request.methods.join(', ')}`, () => {
        enforce(request.method).isValueOf(Request.Method);
      })

      test('url', 'Url is required', () => {
        enforce(request.url).isNotBlank();
      })

    })
  }

}


