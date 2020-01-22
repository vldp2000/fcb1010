import Api from '@/services/Api'
import store from '@/store/store'

export default {
  async getAll () {
    let gigs = await Api()('gigs')
    // console.log('// ----------->> get all gigs')
    // console.log(gigs)
    return gigs
  },
  index (search) {
    let gigs = Api().get('gigs', {
      params: {
        search: search
      }
    })
    console.log('// ----------->> get all gigs')
    console.log(gigs)
    return gigs
  },

  show (gigId) {
    return Api().get(`gigs/${gigId}`)
  },

  async post (gig) {
    try {
      console.log('// ----------->>return Api().post(gig)')
      console.log(gig)
      let result = await Api().post('gig', gig)
      let newGig = await result.data
      console.log('// -----------result')
      console.log(newGig)
      await store.dispatch('addGig', newGig)
    } catch (ex) {
      console.log(ex)
    }
  },

  async put (gig) {
    try {
      console.log('// ----------->>return Api().put(gig{gig.id}, gig)')
      console.log(gig)
      console.log(gig.id)
      let result = await Api().put(`gig/${gig.id}`, gig)
      let newGig = await result.data
      console.log('// -----------result')
      console.log(newGig)
      await store.dispatch('updateGig', newGig)
    } catch (ex) {
      console.log(ex)
    }
  },

  async getGigSongs () {
    let gigSongs = await Api()('gigSongs')
    // console.log('// ----------->> get all gigs')
    // console.log(gigs)
    return gigSongs
  }
}
