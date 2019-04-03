let cheerio = require('cheerio')
let tool = require('./tool')

let daysArr
let freeDays = []

module.exports = {
  getFreeDaysData: getFreeDaysData
}

function getFreeDaysData (url, callback) {
  tool.fetchHTML(url).then(function (body) {
    let $ = cheerio.load(body)
    $('ul').find('li').each(function () {
      let link = $(this).find('a').attr('href')
      tool.fetchHTML(link).then(function (body) {
        fetchDaysStatus(body)
        callback(freeDays, $('ul').find('li').length)
      })
    }, function (error) {
      console.error('%s; %s', error.message, url)
      console.log('%j', error.res.statusCode)
    })
  })
}

function fetchDaysStatus (body) {
  let arr = []
  let $ = cheerio.load(body)
  $('tbody').find('tr').find('td').each(function () {
    // console.log('status: ' + $(this).contents())
    arr.push($(this).contents().toString())
  })
  return getFreeDaysFromArr(arr)
}

function getFreeDaysFromArr (arr) {
  if (!daysArr) {
    daysArr = arr
    return
  }

  let status1
  let status2
  let i = 0
  for (i; i < daysArr.length; i++) {
    status1 = daysArr[i]
    status2 = arr[i]
    if ((status1 === 'OK' || status1 === 'ok') && (status2 === 'OK' || status2 === 'ok')) {
      freeDays[i] = true
    } else {
      freeDays[i] = false
    }
  }
  daysArr = arr
  return freeDays
}

setImmediate(() => {
  console.log('immediate')
})
