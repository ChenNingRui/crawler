let request = require('request')
let resolveUrl = require('url')
let Promise = require('promise')

module.exports = {
  fetchHTML: fetchHTML,
  fetchByLogin: fetchByLogin
}

let previousURL = null

function fetchHTML (url, json = false) {
  if (previousURL) { // convert relative path to absolute path
    url = resolveUrl.resolve(previousURL, url)
  }

  return new Promise(function (resolve, reject) {
    request({
      url: url,
      json: json
    }, function (err, res, body) {
      if (err) {
        return reject(err)
      } else if (res.statusCode !== 200) {
        err = new Error('Unexpected status code: ' + res.statusCode)
        err.res = res
        return reject(err)
      }
      previousURL = url
      resolve(body)
    })
  })
}

function fetchByLogin (url, username, password) {
  var formData = {username: username, password: password, submit: 'login'}
  return new Promise(function (resolve, reject) {
    request = request.defaults({jar: true})
    request({
      url: url + '/login',
      method: 'POST',
      form: formData
    }, function (err, res) {
      if (err) {
        console.log('Oop,error, ' + err)
      }
      request({
        url: url + '/login/booking',
        method: 'GET'
      }, function (err, response) {
        // console.log(response.body)
        // console.log(response.headers)
        resolve(response.body)
      })
    })
  })
}
