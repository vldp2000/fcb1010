import Api from '@/services/Api'
import store from '@/store/store'

export default {
  async getAll () {
    let songs = await Api()('songs')
    // console.log('// ----------->> get all songs')
    // console.log(songs)
    return songs
  },
  index (search) {
    let songs = Api().get('songs', {
      params: {
        search: search
      }
    })
    console.log('// ----------->> get all songs')
    console.log(songs)
    return songs
  },
  show (songId) {
    return Api().get(`songs/${songId}`)
  },

  async post (song) {
    try {
      console.log('// ----------->>return Api().post(song)')
      console.log(song)
      let result = await Api().post('song', song)
      let newSong = await result.data
      console.log('// -----------result')
      console.log(newSong)
      await store.dispatch('addSong', newSong)
    } catch (ex) {
      console.log(ex)
    }
  },

  async put (song) {
    try {
      console.log('// ----------->>return Api().put(song{song.id}, song)')
      console.log(song)
      console.log(song.id)
      let result = await Api().put(`song/${song.id}`, song)
      let newSong = await result.data
      console.log('// -----------result')
      console.log(newSong)
      await store.dispatch('updateSong', newSong)
    } catch (ex) {
      console.log(ex)
    }
  }
}
