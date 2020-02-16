import Api from '@/services/Api'
import Vue from 'vue'

export default {
  async getAllData () {
    let result = await Api().get('all/gig')
    // console.log(data)
    return result.data
  },
  async getId () {
    let result = await Api().get('id/gig')
    console.log(result.data)
    return result.data
  },

  async getAll () {
    let gigs = await Api()('gigs')
    // Vue.$log.debug('// Gig Service ----->> get all gigs')
    // Vue.$log.debug(gigs.data)
    return gigs.data
  },

  index (search) {
    let gigs = Api().get('gigs', {
      params: {
        search: search
      }
    })
    // Vue.$log.debug('// ----------->> get all gigs')
    // Vue.$log.debug(gigs.data)
    return gigs.data
  },

  show (gigId) {
    return Api().get(`gigs/${gigId}`)
  },

  async post (gig) {
    try {
      Vue.$log.debug('// ----------->>return Api().post(gig)')
      Vue.$log.debug(gig)
      let result = await Api().post('gig', gig)
      let newGig = await result.data
      Vue.$log.debug('// -----------result')
      Vue.$log.debug(newGig)
      // await store.dispatch('addGig', newGig)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  async put (gig) {
    try {
      Vue.$log.debug('->> SAve Gig')
      let gigObj = Object.assign({}, gig)
      for (let song of gigObj.songList) {
        delete song.name
        delete song.tempo
        delete song.lirycs
        delete song.tabs
        delete song.createdAt
        delete song.updatedAt
        delete song.programList
      }

      let result = await Api().put(`gig/${gig.id}`, gigObj)
      // let result2 = await Api().put(`savegig/${gig.id}`, gig)
      Vue.$log.debug(result)
      // await store.dispatch('updateGig', newGig)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  async getGigSongs () {
    let gigSongs = await Api()('gigSongs')
    // Vue.$log.debug('// ----------->> get all gigs')
    // Vue.$log.debug(gigs)
    return gigSongs.data
  },

  async putGigSong (gigSong) {
    try {
      Vue.$log.debug('// ----------->>return Api().putGigSong')
      Vue.$log.debug(gigSong)
      await Api().put(`gigSong/${gigSong.id}`, gigSong)
      // let newGigSong = await result.data
      Vue.$log.debug('// -----------result')
      // Vue.$log.debug(newGigSong)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },
  async postGigSong (gigSong) {
    try {
      Vue.$log.debug('// ----------->>return Api().gigSong(gigSong)')
      Vue.$log.debug(gigSong)
      let result = await Api().post('gigSong', gigSong)
      let newGigSong = await result.data
      Vue.$log.debug('// -----------result')
      Vue.$log.debug(newGigSong)
      return newGigSong
      // await store.dispatch('addGig', newGig)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },
  async deleteGigSong (gigSongId) {
    try {
      Vue.$log.debug('// ----------->>return Api().deleteGigSong')
      Vue.$log.debug(gigSongId)
      await Api().delete(`gigSong/${gigSongId}`)
      // let newGigSong = await result.data
      Vue.$log.debug('// -----------result')
      // Vue.$log.debug(newGigSong)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  }
}
