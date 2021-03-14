import Api from '@/services/Api'
import Vue from 'vue'

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
    await Api().put(`instrument/${instrument.id}`, instrument)
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
