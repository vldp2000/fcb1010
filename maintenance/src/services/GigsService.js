import Api from '@/services/Api'
import Vue from 'vue'

export default {
  async getAllData () {
    let result = await Api().get('all/gig')
    return result.data
  },

  async getId () {
    let result = await Api().get('id/gig')
    return result.data.id
  },

  async putGig (gig) {
    try {
      let gigObj = Object.assign({}, gig)
      delete gigObj.songList
      await Api().put(`gig/${gig.id}`, gigObj)
    } catch (ex) {
      Vue.$log.error(ex)
    }
  },

  async saveScheduledGigId (id) {
    try {
      const gigIdObj = { 'id': id }
      await Api().put('currentgig', gigIdObj)
    } catch (ex) {
      Vue.$log.error(ex)
    }
  },
  async getScheduledGigId (id) {
    try {
      let result = await Api().get('currentgig')
      return result.data.id
    } catch (ex) {
      Vue.$log.error(ex)
    }
  }
}
