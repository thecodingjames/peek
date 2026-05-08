import VestModel from '../core/vest.model.js'

export default class Response extends VestModel {
  
  constructor(props) {
    super()

    Object.assign(this, props)
  }

  static instantiate(data) {
    const response = new Response(data)

    if (response.hasErrors()) {
      throw new Error(JSON.stringify(response.getErrors()))
    } else {
      return response
    }
  }

  vestSuite() {
    return Vest.create( response => {
      const { test, enforce, compose } = Vest

      test('url', 'Url is required', () => {
        enforce(response.url).isNotBlank()
      })

      test('code', 'Code must be a number between 100 and 500', () => {
        enforce(response.code).isBetween(100, 599)
      })

      test('statusText', 'Status text is required', () => {
        enforce(response.statusText).isNotBlank()
      })

      test('headers', 'Headers must be an object', () => {
        enforce(response.headers).allOf(
          enforce.isNotEmpty(),
          enforce.condition(headers => (headers instanceof Object))
        )
      })

      test('redirected', 'Redirected must be a boolean', () => {
        enforce(response.redirected).isBoolean()
      })
    })
  }

}
