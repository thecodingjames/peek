import VestModel from '../core/vest.model.js'
import t from '../translate/translate.service.js'

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

      test('url', t.response.model.validations.url, () => {
        enforce(response.url).isNotBlank()
      })

      test('code', t.response.model.validations.code, () => {
        enforce(response.code).isBetween(100, 599)
      })

      test('statusText', t.response.model.validations.status, () => {
        enforce(response.statusText).isNotBlank()
      })

      test('headers', t.response.model.validations.headers, () => {
        enforce(response.headers).allOf(
          enforce.isNotEmpty(),
          enforce.condition(headers => (headers instanceof Object))
        )
      })

      test('redirected', t.response.model.validations.redirected, () => {
        enforce(response.redirected).isBoolean()
      })
    })
  }

}
