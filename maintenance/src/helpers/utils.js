
let dataTableClickCount = 0
let clickTimer = null

export function singleOrDoubleRowClick (item, singleClickFunc, doubleClickFunc) {
  try {
    dataTableClickCount++
    if (dataTableClickCount === 1) {
      clickTimer = setTimeout(function () {
        dataTableClickCount = 0
        singleClickFunc(item)
      }, 250)
    } else if (dataTableClickCount === 2) {
      clearTimeout(clickTimer)
      dataTableClickCount = 0
      doubleClickFunc(item)
    }
  } catch (ex) {
    console.log(ex)
  }
}
