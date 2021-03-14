import Api from '@/services/Api'

export default {

  async getAllData () {
    let result = await Api().get('all/song')
    return result.data
  },
  async getId () {
    let result = await Api().get('id/song')
    return result.data.id
  },

  async putSong (song) {
    try {
      let songObj = Object.assign({}, song)
      delete songObj.ordernumber
      delete songObj.createdAt
      delete songObj.updatedAt
      let result = await Api().put(`song/${songObj.id}`, songObj)
      return result
    } catch (ex) {
      Vue.$log.error(ex)
    }
  }
}
