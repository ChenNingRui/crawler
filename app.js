let cheerio = require('cheerio')
let tool = require('./tool')
let calender = require('./calender')
let cinema = require('./cinema')
let restaurant = require('./restaurant')

let hrefArr = []
let times = 0
let calenderData = null
let moviesData = null
let tablesData = null

init()

function init () {
  let url = process.argv[2]
  tool.fetchHTML(url).then(function (body) {
    let $ = cheerio.load(body)
    $('ol').find('li').each(function (i) {
      let href = $(this).find('a').attr('href')
      hrefArr.push(href)
    })
    fetchData()
  })
}

function fetchData () {
  calender.getFreeDaysData(hrefArr[0], calenderCallback)
}

function calenderCallback (data, runTimes) {
  times++
  if (runTimes === times) {
    calenderData = data
    cinema.getMovieData(hrefArr[1], movieCallback)
  }
}

function movieCallback (data) {
  moviesData = data
  restaurant.getTablesData(hrefArr[2], restaurantCallback)
}

function restaurantCallback (data) {
  tablesData = data
  printResult()
}

function printResult () {
  // console.log(calenderData)
  // console.log(moviesData)
  // console.log(tablesData)
  let calenderArr = []
  let movieArr = []
  let tablesArr = []
  for (let i = 0; i < calenderData.length; i++) {
    if (calenderData[i]) {
      for (let j = 0; j < moviesData.length; j++) {
        if (i === moviesData[j].day) {
          movieArr.push(moviesData[j])
        }
      }
      tablesArr[i] = tablesData[i]
      calenderArr.push(i)
    }
  }

  let day
  for (let i = 0; i < calenderArr.length; i++) {
    switch (calenderArr[i]) {
      case 0:
        day = 'Friday'
        break
      case 1:
        day = 'Saturday'
        break
      case 2:
        day = 'Sunday'
        break
    }
    for (let j = 0; j < movieArr.length; j++) {
      if (movieArr[j].day === calenderArr[i]) {
        let arr = tablesArr[calenderArr[i]]
        for (let v = 0; v < arr.length; v++) {
          let period = arr[v].split('-')[0]
          if (parseInt(period) > movieArr[j].time) {
            console.log('* on ' + day + ' there is a free table between ' +
            arr[v].split('-')[0] + ':00 and ' +
            arr[v].split('-')[1] + ':00, after you have seen "' +
            movieArr[j].movie + '", which start at ' + movieArr[j].time + ':00')
            console.log('  ')
          }
        }
      }
    }
  }
}
