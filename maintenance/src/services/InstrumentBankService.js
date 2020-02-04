import Api from '@/services/Api'
// import store from '@/store/store'

export default {

  async getAll () {
    let instrumentBanks = await Api()('instrumentBanks')
    // console.log('// ---//-----//--->> get all instrumentBank records')
    // console.log(instrumentBanks.data)
    return instrumentBanks.data
  },

  async index (search) {
    let instrumentBank = await Api().get('instrumentBank', {
      params: {
        search: search
      }
    })
    // console.log('// ----------->> get all instrumentBank')
    // console.log(instrumentBank.data)
    return instrumentBank.data
  },

  show (id) {
    let result = Api().get(`instrumentBank/${id}`)
    return result.data
  },

  async post (instrumentBank) {
    console.log('// ----------->>return Api().post(instrumentBank)')
    console.log(instrumentBank)
    let result = await Api().post('instrumentBank', instrumentBank)
    let newObj = await result.data
    console.log('// -----------result')
    console.log(newObj)
    // store.dispatch('addInstrumentBank', newObj)
  },

  async put (instrumentBank) {
    console.log('// ----------->>return Api().put(instrumentBank{instrumentBannk.id}, instrumentBank)')
    console.log(instrumentBank)
    console.log(instrumentBank.id)
    let result = await Api().put(`instrumentBank/${instrumentBank.id}`, instrumentBank)
    let newObj = await result.data
    console.log('// -----------result')
    console.log(newObj)
    // store.dispatch('updateInstrumentBank', newObj)
  }
}
