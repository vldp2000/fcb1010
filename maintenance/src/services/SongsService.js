import Api from '@/services/Api'
import store from '@/store/store'

export default {
  index (search) {
    return Api().get('songs', {
      params: {
        search: search
      }
    })
  },

  show (songId) {
    return Api().get(`songs/${songId}`)
  },

  async post (song) {
    console.log('// ----------->>return Api().post(song)')
    console.log(song)
    let result = await Api().post('song', song).data
    console.log(result)
    store.dispatch('addSong', result)
  },

  async put (song) {
    console.log('// ----------->>return Api().put(song{song.id}, song)')
    console.log(song)
    console.log(song.id)
    // let result = await updateSong(song)
    let result = await Api().put(`song/${song.id}`, song)
    console.log(result.data)
    store.dispatch('updateSong', result.data)
  }
}
