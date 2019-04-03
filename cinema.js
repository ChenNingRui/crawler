let cheerio = require('cheerio')
let tool = require('./tool')

module.exports = {
  getMovieData: getMovieData
}

let daysArr = []
let moviesArr = []
let movieNameArr = []
let resultArr = []
let curPageUrl

function getMovieData (url, callback) {
  curPageUrl = url
  tool.fetchHTML(url).then(function (body) {
    let $ = cheerio.load(body)

    // day
    $('#day').find('option').each(function () {
      let daySelec = $(this).attr('value')
      if (daySelec.indexOf('--- Pick a Day ---') === -1 &&
      daySelec !== '') {
        daysArr.push(daySelec)
      }
    })

    // moive
    $('#movie').find('option').each(function () {
      let movieSelec = $(this).attr('value')
      if (movieSelec.indexOf('--- Pick a Movie ---') === -1 &&
      movieSelec !== '') {
        moviesArr.push(movieSelec)
        movieNameArr.push($(this).contents().toString())
      }
    })
  }).then(function () {
    let i = 0
    let j
    for (i; i < moviesArr.length; i++) {
      for (j = 0; j < daysArr.length; j++) {
        let url = combineDataToUrl(daysArr[j], moviesArr[i])
        tool.fetchHTML(url).then(function (str) {
          let json = JSON.parse(str)
          for (let i = 0; i < json.length; i++) {
            if (json[i].status === 1) {
              json[i].movie = movieNameArr[parseInt(json[i].movie) - 1]
              switch (json[i].day) {
                case '05':
                  json[i].day = 0
                  break
                case '06':
                  json[i].day = 1
                  break
                case '07':
                  json[i].day = 2
                  break
              }
              json[i].time = json[i].time.split(':')[0]
              resultArr.push(json[i])
            }
          }
        })
      }
    }
    callback(resultArr)
  })
}

function combineDataToUrl (day, movie) {
  return curPageUrl + '/check?day=' + day + '&movie=' + movie
}
