export default class Request {

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

  get errors() {
    return validators.run(this);
  }

  constructor() {
    this.method = Request.Method.get
  }

}

const validators = Vest.create( request => {
  const { test, enforce } = Vest

  test('url', 'Url is required', () => {
    enforce(request.url).isNotBlank();
  })

})

