
let clickCount = 0
let clickTimer = null

export function singleOrDoubleRowClick (item, singleClickFunc, doubleClickFunc) {
  try {
    clickCount++
    if (clickCount === 1) {
      clickTimer = setTimeout(function () {
        clickCount = 0
        singleClickFunc(item)
      }, 250)
    } else if (clickCount === 2) {
      clearTimeout(clickTimer)
      clickCount = 0
      doubleClickFunc(item)
    }
  } catch (ex) {
    this.$log.debug(ex)
  }
}
