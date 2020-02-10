import Api from '@/services/Api'
import Vue from 'vue'

export default {

  async getAll () {
    try {
      // Vue.$log.debug('// ----------->> get all songs')
      let songs = await Api()('songs')
      // Vue.$log.debug(songs.data)
      return songs.data
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  getData (songId) {
    let result = Api().get(`song/${songId}`)
    return result.data
  },

  async postSong (song) {
    try {
      let result = await Api().post('song', song)
      let newSong = await result.data
      // Vue.$log.debug(newSong)
      return newSong
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  async putSong (song) {
    try {
      let result = await Api().put(`song/${song.id}`, song)
      // Vue.$log.debug('// -----------result')
      Vue.$log.debug(result.data)
      return result
      // await store.dispatch('updateSong', newSong)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  // -- SONG PROGRAM PRESET -------
  async getSongItems (songId) {
    Vue.$log.debug(`// ----------->> get songitems by id ${songId}`)
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
      Vue.$log.debug(songPrograms)
      return songPrograms
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  async postSongPreset (songPreset) {
    try {
      // Vue.$log.debug('// ----------->>return Api().postSongPreset')
      // Vue.$log.debug(songPreset)
      let result = await Api().post('songprogrampreset', songPreset)
      let newSongPreset = await result.data
      // Vue.$log.debug('// -----------result')
      // Vue.$log.debug(newSongPreset)
      return newSongPreset
      // await store.dispatch('addSongPreset', newSongPreset)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  async putSongPreset (songPreset) {
    try {
      // Vue.$log.debug('// --->>Api().putSongPreset')
      // Vue.$log.debug(songPreset.id)
      let result = await Api().put(`songprogrampreset/${songPreset.id}`, songPreset)
      let newSongPreset = await result.data
      return newSongPreset
      // Vue.$log.debug(newSongPreset)
      // await store.dispatch('updateSongPreset', newSongPreset)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  // -- SONG PROGRAM  -------
  async postSongProgram (songProgram) {
    try {
      // Vue.$log.debug('// ----------->>return Api().postSongProgram')
      // Vue.$log.debug(songProgram)
      let result = await Api().post('songprogram', songProgram)
      let newSongProgram = await result.data
      // Vue.$log.debug('// -----------result = ', newSongProgram)
      return newSongProgram
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },
  async putSongProgram (songProgram) {
    try {
      // Vue.$log.debug('// --->>Api().putSongProgram')
      // Vue.$log.debug(songProgram.id)
      let result = await Api().put(`songprogram/${songProgram.id}`, songProgram)
      let newSongProgram = await result.data
      return newSongProgram
      // Vue.$log.debug(newSongProgram)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  }
}
