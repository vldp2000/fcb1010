import Api from '@/services/Api'
import store from '@/store/store'

export default {

  async getAll () {
    let instruments = await Api()('instruments')
    console.log('// ----------->> get all instruments')
    console.log(instruments)
    return instruments
  },

  async index (search) {
    let instruments = await Api().get('instruments', {
      params: {
        search: search
      }
    })
    console.log('// ----------->> get all instrument')
    console.log(instruments.data)
    return instruments.data
  },

  show (id) {
    return Api().get(`instruments/${id}`)
  },

  async post (instrument) {
    console.log('// ----------->>return Api().post(instrument)')
    console.log(instrument)
    let result = await Api().post('instrument', instrument)
    let newObj = await result.data
    console.log('// -----------result')
    console.log(newObj)
    store.dispatch('addInstrument', newObj)
  },

  async put (instrument) {
    console.log('// ----------->>return Api().put(instrument{instrument.id}, instrument)')
    console.log(instrument)
    console.log(instrument.id)
    let result = await Api().put(`instrument/${instrument.id}`, instrument)
    let newObj = await result.data
    console.log('// -----------result')
    console.log(newObj)
    store.dispatch('updateInstrument', newObj)
  }
}
