class Axo {
  constructor (options) {
    this.callbacks = {}
    this.uri = options.hasOwnProperty('uri') ? options.uri : '/'
    this.method = options.hasOwnProperty('method') ? options.method : 'GET'
    this.data = options.hasOwnProperty('data') ? options.data : null
    this.contentType = options.hasOwnProperty('contentType') ?
      options.contentType :
      'application/x-www-form-urlencoded; charset=UTF-8'
    this.accept = options.hasOwnProperty('accept') ? options.accept : '*/*'

    for (const key in options) {
      if ((!isNaN(key) && (key >= 100 && key <= 511)) ||
        (key.toLowerCase() === 'error' ||
          key.toLowerCase() === 'success' ||
          key.toLowerCase() === 'always')
      ) {
        this.callbacks[key] = options[key]
      }
    }

    this.req = new XMLHttpRequest()

    this.req.addEventListener('load', this.handleResponse.bind(this))
    this.req.addEventListener('error', this.handleResponse.bind(this))

    this.req.open(this.method, this.uri)
    this.req.setRequestHeader('Content-Type', this.contentType)
    this.req.setRequestHeader('Accept', this.accept)
    this.req.send(this.data)
  }

  handleResponse (event) {
    let code = event.target.status
    let response = event.target.response
    let error = code >= 400 ? new Error(event.target.statusText) : null

    if (this.callbacks.hasOwnProperty(code)) {
      this.callbacks[code](error || response, this.req)
    }
    if (!error && this.callbacks.hasOwnProperty('success')) {
      this.callbacks.success(response, this.req)
    } else if (this.callbacks.hasOwnProperty('error')) {
      this.callbacks.error(error, this.req)
    }
    if (this.callbacks.hasOwnProperty('always')) {
      this.callbacks.always(error || response, this.req)
    }
  }

  success (callback) {
    this.callbacks['success'] = callback
    return this
  }

  error (callback) {
    this.callbacks['error'] = callback
    return this
  }

  always (callback) {
    this.callbacks['always'] = callback
    return this
  }
}
