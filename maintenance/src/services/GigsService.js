import Api from '@/services/Api'
import Vue from 'vue'

export default {
  async getAllData () {
    let result = await Api().get('all/gig')
    // console.log(result.data)
    return result.data
  },

  async getId () {
    let result = await Api().get('id/gig')
    // console.log(result.data)
    return result.data.id
  },

  async putGig (gig) {
    try {
     // Vue.$log.debug('->> SAve Gig')
      let gigObj = Object.assign({}, gig)
      delete gigObj.songList

      let result = await Api().put(`gig/${gig.id}`, gigObj)
      // let result2 = await Api().put(`savegig/${gig.id}`, gig)
     // Vue.$log.debug(result)
      // await store.dispatch('updateGig', newGig)
    } catch (ex) {
      Vue.$log.error(ex)
    }
  },

  async saveScheduledGigId (id) {
    try {
     // Vue.$log.debug('->> saveScheduledGigId')
      const gigIdObj = { 'id': id }
      let result = await Api().put('currentgig', gigIdObj)
     // Vue.$log.debug(result)
    } catch (ex) {
      Vue.$log.error(ex)
    }
  },
  async getScheduledGigId (id) {
    try {
     // Vue.$log.debug('->> getScheduledGigId')
      let result = await Api().get('currentgig')
     // Vue.$log.debug(result.data)
      return result.data.id
    } catch (ex) {
      Vue.$log.error(ex)
    }
  }
}
