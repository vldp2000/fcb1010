import Api from '@/services/Api'

export default {

  async getAllData () {
    let result = await Api().get('all/instrument')
    return result.data
  },
  async getId () {
    let result = await Api().get('id/instrument')
    return result.data.id
  },

  async put (instrument) {
    let result = await Api().put(`instrument/${instrument.id}`, instrument)
    let newObj = await result.data
  },

  async getInstrumentIcons (files) {
    try {
      let result = []
      await files.keys().forEach(key => {
        const pathLong = files(key)
        const pathShort = key
        let id = -1
        if (pathShort.includes('image_')) {
          id = key.substring(8, 10)
          const item = { 'id': parseInt(id, 10), 'url': pathLong }
          result.push(item)
        }
      })
      return result
    } catch (ex) {
      Vue.$log.error(ex)
    }
  }
}
