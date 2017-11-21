/* global XMLHttpRequest */
/**
 * Axo Class Definition
 * @author will-shaw
 * @license MIT
 */

class Axo { // eslint-disable-line no-unused-vars
  constructor (options) {
    this.defaults = {
      method: 'GET',
      uri: '/',
      data: null,
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      accept: '*/*'
    }

    this.callbacks = {}

    this.uri = options.uri || this.defaults.uri
    this.method = options.method || this.defaults.method
    this.data = options.data || this.defaults.data
    this.contentType = options.contentType || this.defaults.contentType
    this.accept = options.accept || this.defaults.accept

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

  convert (data) {
    try {
      data = JSON.parse(data)
    } catch (err) {
      // Will attempt to convert, if failed returns original data.
    }
    return data
  }

  handleResponse (event) {
    let code = event.target.status
    let response = this.convert(event.target.response)
    let error = code >= 400 ? new Error(event.target.statusText) : null

    if (this.callbacks[code]) {
      this.callbacks[code](error || response, this.req)
    }
    if (!error && this.callbacks.success) {
      this.callbacks.success(response, this.req)
    } else if (this.callbacks.error) {
      this.callbacks.error(error, this.req)
    }
    if (this.callbacks.always) {
      this.callbacks.always(error || response, this.req)
    }
  }

  success (callback) {
    this.callbacks.success = callback
    return this
  }

  error (callback) {
    this.callbacks.error = callback
    return this
  }

  always (callback) {
    this.callbacks.always = callback
    return this
  }
}
