import * as moment from "moment-timezone"

export const transform = ($) => {
  const table = $('#fetched-data-container');

  const today = moment.tz("Europe/Kiev").format('DD.MM.YYYY');
  const tomorrow = moment.tz("Europe/Kiev").add(1, 'day').format('DD.MM.YYYY');

  const firstRow = table.find('tbody  tr')[3]
  const secondRow = table.find('tbody  tr')[4]

  let todayEvents = []
  let tomorrowEvents = []

  let hasTodayData = false;
  let hasTomorrowData = false;

  if ($(firstRow.children[0]).text().trim() === today) {
    todayEvents = addTodayEvents($, firstRow.children)
    hasTodayData = true
  }

  if ($(firstRow.children[0]).text().trim() === tomorrow) {
    tomorrowEvents = addTomorrowEvents($, firstRow.children)
    hasTomorrowData = true
  }

  if ($(secondRow.children[0]).text().trim() === today) {
    todayEvents = addTodayEvents($, secondRow.children)
    hasTodayData = true
  }

  if ($(secondRow.children[0]).text().trim() === tomorrow) {
    tomorrowEvents = addTomorrowEvents($, secondRow.children)
    hasTomorrowData = true
  }

  return {
    events: [...todayEvents, ...tomorrowEvents],
    hasTodayData,
    hasTomorrowData
  }
}

const addTodayEvents = ($, element) => {
  const date = moment.tz("Europe/Kiev").format('YYYY-MM-DD');
  return addEvents($, element, date)
}

const addTomorrowEvents = ($, element) => {
  const date = moment.tz("Europe/Kiev").add(1, 'day').format('YYYY-MM-DD');
  return addEvents($, element, date)
}

const queueMap = {
  [1]: "1",
  [2]: "2",
  [3]: "3",
  [4]: "4",
  [5]: "5",
  [6]: "6",
}

const addEvents = ($, element, date) => {
  let result = []

  element.forEach((element, index) => {
    if (index > 0) {
      element.children.forEach((el) => {
        const timeRange = $(el).text().split(' - ')

        if (timeRange.length === 2) {
          result.push({
            date,
            startTime: timeRange[0],
            endTime: timeRange[1],
            electricity: "off",
            provider: "RIVOE",
            queue: queueMap[index]
          })
        }
      })
    }
  })

  return result
}