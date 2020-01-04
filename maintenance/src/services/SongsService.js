import Api from '@/services/Api'
import store from '@/store/store'

export default {

  async getAll () {
    try {
      console.log('// ----------->> get all songs')
      let songs = await Api()('songs')
      // console.log(songs)
      return songs
    } catch (ex) {
      console.log(ex)
    }
  },

  async getSongItems (songId) {
    try {
      let items = await Api().get(`songitems/${songId}`)
      console.log(`// ----------->> get songitems by id ${songId}`)
      console.log(items)
      let programs = await items.data.songPrograms
      let presets = await items.data.songProgramPresets

      presets.forEach(item => {
        let program = programs.find(pr => pr.id === item.refsongprogram)
        if (!program.presetList) {
          program.presetList = []
        }
        program.presetList.push(item)
      })
      console.log(programs)
      return items
    } catch (ex) {
      console.log(ex)
    }
  },

  getData (songId) {
    return Api().get(`song/${songId}`)
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
