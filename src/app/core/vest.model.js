export default class VestModel {
  // Inherit this class on models you want to implement validations behavior
  // don't touch underscored members, can't use private fields with Vue's reactive proxies

  constructor() {
    this._validators = this.vestSuite()
    this._validate()

    return new Proxy(this, {

      get(target, prop, receiver) {
        const value = target._validations[prop]

        if ( (typeof(value) == "function") || (value instanceof Function)) {
          return (...args) => value.apply(target._validations, args)
        }

        return Reflect.get(target, prop, receiver)
      },

      set(target, prop, args, receiver) {
        const value = Reflect.set(target, prop, args, receiver)
        target._validate()

        return value
      },

    });

  }

  rules(field) {
    const errors = this.getErrors(field).join(', ')

    // Formatted per
    // vuetifyjs.com/en/components/forms/#rules
    return [ !errors ? true : errors ]
  }

  get validations() {
    return this._validations
  }

  _validate() {
    this._validations = this._validators.run(this);
  }

  // Override this function
  vestSuite() {
    throw new Error('Must override vestSuite() in subclass')

    // Example
    /*
    return Vest.create( data => {
      const { test, enforce } = Vest

      test('username', 'Username is required', () => {
        enforce(data.username).isNotBlank();
      })

    })
    */
  }
}
