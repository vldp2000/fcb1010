import Api from '@/services/Api'
import Vue from 'vue'

export default {

  async getAllData () {
    let result = await Api().get('all/instrumentbank')
    // console.log(data)
    return result.data
  },
  async getId () {
    let result = await Api().get('id/instrumentbank')
    // console.log(result.data.id)
    return result.data.id
  },

  async put (instrumentBank) {
    Vue.$log.debug('// ----------->>return Api().put(instrumentBank{instrumentBannk.id}, instrumentBank)')
    Vue.$log.debug(instrumentBank)
    Vue.$log.debug(instrumentBank.id)
    let result = await Api().put(`instrumentbank/${instrumentBank.id}`, instrumentBank)
    let newObj = await result.data
    Vue.$log.debug('// -----------result')
    Vue.$log.debug(newObj)
    // store.dispatch('updateInstrumentBank', newObj)
  }

  // async getAll () {
  //   let instrumentBanks = await Api()('instrumentBanks')
  //   // Vue.$log.debug('// ---//-----//--->> get all instrumentBank records')
  //   // Vue.$log.debug(instrumentBanks.data)
  //   return instrumentBanks.data
  // },

  // async index (search) {
  //   let instrumentBank = await Api().get('instrumentBank', {
  //     params: {
  //       search: search
  //     }
  //   })
  //   // Vue.$log.debug('// ----------->> get all instrumentBank')
  //   // Vue.$log.debug(instrumentBank.data)
  //   return instrumentBank.data
  // },

  // show (id) {
  //   let result = Api().get(`instrumentBank/${id}`)
  //   return result.data
  // },

  // async post (instrumentBank) {
  //   Vue.$log.debug('// ----------->>return Api().post(instrumentBank)')
  //   Vue.$log.debug(instrumentBank)
  //   let result = await Api().post('instrumentBank', instrumentBank)
  //   let newObj = await result.data
  //   Vue.$log.debug('// -----------result')
  //   Vue.$log.debug(newObj)
  //   // store.dispatch('addInstrumentBank', newObj)
  // },

  // async put (instrumentBank) {
  //   Vue.$log.debug('// ----------->>return Api().put(instrumentBank{instrumentBannk.id}, instrumentBank)')
  //   Vue.$log.debug(instrumentBank)
  //   Vue.$log.debug(instrumentBank.id)
  //   let result = await Api().put(`instrumentBank/${instrumentBank.id}`, instrumentBank)
  //   let newObj = await result.data
  //   Vue.$log.debug('// -----------result')
  //   Vue.$log.debug(newObj)
  //   // store.dispatch('updateInstrumentBank', newObj)
  // }
}
