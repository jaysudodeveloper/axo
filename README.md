# Axo = Asyncronous XmlHTTPRequest Object

## Options

| Options         | Domain      | Default Value                       |
|:---------------:|:-----------:|:------------------------------------|
| `method`        | HTTP Method | `GET`                               |
| `uri`           | String      | `/`                                 |
| `data`          | Any         | `null`                              |
| `contentType`   | String      | `application/x-www-form-urlencoded` |
| `accept`        | String      | `*/*`                               |
| `<status_code>` | Function    | -                                   |
| `success`       | Function    | -                                   |
| `error`         | Function    | -                                   |
| `always`        | Function    | -                                   |

## Usage Examples

### Get Request

``` javascript

let options = {
  uri: '/content',
  accept: 'application/json',
  200: (data) => {
    console.log(`Here is your data: ${data}`)
  },
  404: () => {
    console.log('Oops that uri doesn\'t exist')
  }
}

let request = new Axo (options)
  .success(data => { ... })
  .error(err => { ... })
  .always(data => { ... })

```
