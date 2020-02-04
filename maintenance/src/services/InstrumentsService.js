import Api from '@/services/Api'
// import store from '@/store/store'

export default {

  async getAll () {
    let instruments = await Api()('instruments')
    // console.log('// ----------->> get all instruments')
    // console.log(instruments.data)
    return instruments.data
  },

  async index (search) {
    let instruments = await Api().get('instruments', {
      params: {
        search: search
      }
    })
    // console.log('// ----------->> get all instrument')
    // console.log(instruments.data)
    return instruments.data
  },

  show (id) {
    let result = Api().get(`instruments/${id}`)
    return result.data
  },

  async post (instrument) {
    console.log('// ----------->>return Api().post(instrument)')
    console.log(instrument)
    let result = await Api().post('instrument', instrument)
    let newObj = await result.data
    console.log('// -----------result')
    console.log(newObj)
    // store.dispatch('addInstrument', newObj)
  },

  async put (instrument) {
    console.log('// ----------->>return Api().put(instrument{instrument.id}, instrument)')
    console.log(instrument)
    console.log(instrument.id)
    let result = await Api().put(`instrument/${instrument.id}`, instrument)
    let newObj = await result.data
    console.log('// -----------result')
    console.log(newObj)
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
      // console.log(result)
      return result
    } catch (ex) {
      console.log(ex)
    }
  }
}
