import Api from '@/services/Api'
import Vue from 'vue'

export default {

  async getAllData () {
    let result = await Api().get('all/instrument')
    // console.log(data)
    return result.data
  },
  async getId () {
    let result = await Api().get('id/instrument')
    console.log(result.data)
    return result.data
  },
  async getAll () {
    let instruments = await Api()('instruments')
    // Vue.$log.debug('// ----------->> get all instruments')
    // Vue.$log.debug(instruments.data)
    return instruments.data
  },

  async index (search) {
    let instruments = await Api().get('instruments', {
      params: {
        search: search
      }
    })
    // Vue.$log.debug('// ----------->> get all instrument')
    // Vue.$log.debug(instruments.data)
    return instruments.data
  },

  show (id) {
    let result = Api().get(`instruments/${id}`)
    return result.data
  },

  async post (instrument) {
    Vue.$log.debug('// ----------->>return Api().post(instrument)')
    Vue.$log.debug(instrument)
    let result = await Api().post('instrument', instrument)
    let newObj = await result.data
    Vue.$log.debug('// -----------result')
    Vue.$log.debug(newObj)
    // store.dispatch('addInstrument', newObj)
  },

  async put (instrument) {
    Vue.$log.debug('// ----------->>return Api().put(instrument{instrument.id}, instrument)')
    Vue.$log.debug(instrument)
    Vue.$log.debug(instrument.id)
    let result = await Api().put(`instrument/${instrument.id}`, instrument)
    let newObj = await result.data
    Vue.$log.debug('// -----------result')
    Vue.$log.debug(newObj)
    // store.dispatch('updateInstrument', newObj)
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
      // Vue.$log.debug(result)
      return result
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  }
}
