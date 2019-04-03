let cheerio = require('cheerio')
let tool = require('./tool')

module.exports = {
  getTablesData: getTablesData
}

let username = 'zeke'
let password = 'coys'

let daysArr = []

function getTablesData (url, callback) {
  tool.fetchByLogin(url, username, password)
  .then(function (body) {
    let $ = cheerio.load(body)
    let friArr = []
    let satArr = []
    let sunArr = []
    $('div.WordSection2').find('p').each(function () {
      let contents = $(this).find('span').contents()
      let obj = contents.toString().split(' ')
      if (obj[1] === 'Free') {
        friArr.push(obj[0])
      }
    })
    $('div.WordSection4').find('p').each(function () {
      let contents = $(this).find('span').contents()
      let obj = contents.toString().split(' ')
      if (obj[1] === 'Free') {
        satArr.push(obj[0])
      }
    })
    $('div.WordSection6').find('p').each(function () {
      let contents = $(this).find('span').contents()
      let obj = contents.toString().split(' ')
      if (obj[1] === 'Free') {
        sunArr.push(obj[0])
      }
    })

    daysArr.push(friArr)
    daysArr.push(satArr)
    daysArr.push(sunArr)

    callback(daysArr)
  })
}
