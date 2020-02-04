import Api from '@/services/Api'
// import store from '@/store/store'
// import InstrumentsService from '@/services/InstrumentsService'
// import InstrumentBankService from '@/services/InstrumentBankService'
// import PresetsService from '@/services/PresetsService'
// import GigsService from '@/services/GigsService'

export default {

  async getAll () {
    try {
      // console.log('// ----------->> get all songs')
      let songs = await Api()('songs')
      // console.log(songs.data)
      return songs.data
    } catch (ex) {
      console.log(ex)
    }
  },

  getData (songId) {
    let result = Api().get(`song/${songId}`)
    return result.data
  },

  async post (song) {
    try {
      // console.log('// ----------->>return Api().post(song)')
      // console.log(song)
      let result = await Api().post('song', song)
      let newSong = await result.data
      console.log(newSong)
      // console.log('// -----------result')
      // console.log(newSong)
      // await store.dispatch('addSong', newSong)
    } catch (ex) {
      console.log(ex)
    }
  },

  async put (song) {
    try {
      // console.log('// ----------->>return Api().put(song{song.id}, song)')
      // console.log(song)
      // console.log(song.id)
      let result = await Api().put(`song/${song.id}`, song)

      // let newSong = await result.data
      // console.log('// -----------result')
      console.log(result.data)
      // await store.dispatch('updateSong', newSong)
    } catch (ex) {
      console.log(ex)
    }
  },

  async getSongItems (songId) {
    // console.log(`// ----------->> get songitems by id ${songId}`)
    try {
      let items = await Api().get(`songitems/${songId}`)
      let programs = await items.data.songPrograms
      let presets = await items.data.songProgramPresets

      presets.forEach(item => {
        let program = programs.find(pr => pr.id === item.refsongprogram)
        if (!program.presetList) {
          program.presetList = []
        }
        program.presetList.push(item)
      })
      const songPrograms = { 'songId': songId, 'programs': programs }
      // console.log(songPrograms)
      return songPrograms
    } catch (ex) {
      console.log(ex)
    }
  },

  async postSongPreset (songPreset) {
    try {
      console.log('// ----------->>return Api().postSongPreset')
      console.log(songPreset)
      let result = await Api().postSongPreset('songprogrampreset', songPreset)
      let newSongPreset = await result.data
      console.log('// -----------result')
      console.log(newSongPreset)
      // await store.dispatch('addSongPreset', newSongPreset)
    } catch (ex) {
      console.log(ex)
    }
  },

  async putSongPreset (songPreset) {
    try {
      console.log('// --->>Api().putSongPreset')
      console.log(songPreset.id)
      let result = await Api().put(`songprogrampreset/${songPreset.id}`, songPreset)
      let newSongPreset = await result.data
      console.log('// -----------result')
      console.log(newSongPreset)
      // await store.dispatch('updateSongPreset', newSongPreset)
    } catch (ex) {
      console.log(ex)
    }
  }
}
