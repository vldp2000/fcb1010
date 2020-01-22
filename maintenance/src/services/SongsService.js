import Api from '@/services/Api'
import store from '@/store/store'
import InstrumentsService from '@/services/InstrumentsService'
import InstrumentBankService from '@/services/InstrumentBankService'
import PresetsService from '@/services/PresetsService'
import GigsService from '@/services/GigsService'
export default {

  async getAll () {
    try {
      // console.log('// ----------->> get all songs')
      let songs = await Api()('songs')
      // console.log(songs)
      return songs
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
      // console.log(songId)
      const payload = { 'id': songId, 'programs': programs }
      await store.dispatch('addSongItems', payload)
      return songId
    } catch (ex) {
      console.log(ex)
    }
  },

  getData (songId) {
    return Api().get(`song/${songId}`)
  },

  async post (song) {
    try {
      // console.log('// ----------->>return Api().post(song)')
      // console.log(song)
      let result = await Api().post('song', song)
      let newSong = await result.data
      // console.log('// -----------result')
      // console.log(newSong)
      await store.dispatch('addSong', newSong)
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
      let newSong = await result.data
      // console.log('// -----------result')
      // console.log(newSong)
      await store.dispatch('updateSong', newSong)
    } catch (ex) {
      console.log(ex)
    }
  },

  async initAll () {
    try {
      // console.log('// ----------->>init ALL)')
      if (store.state.gigList.length === 0) {
        // console.log('Init gig storage')
        let result = await GigsService.getAll()
        let list = await result.data
        // console.log('<< Init Gig List?>>')
        await store.dispatch('setGigList', list)
        // console.log(this.$store.state.songList)
      } else {
        console.log(' Song List already populated')
      }

      if (store.state.songList.length === 0) {
        // console.log('Init songs storage')
        let result = await this.getAll()
        let list = await result.data
        // console.log('<< Init Song List?>>')
        await store.dispatch('setSongList', list)
        // console.log(this.$store.state.songList)
      } else {
        console.log(' Song List already populated')
      }

      if (store.state.instrumentList.length === 0) {
        // console.log('Init instruments storage')
        let result = await InstrumentsService.getAll()
        let list = await result.data
        // console.log('<< Init instrument List?>>')
        await store.dispatch('setInstrumentList', list)
        // console.log(this.$store.state.instrumentList)
        await this.importAll(require.context('../assets/', false, /\.png$/))
      } else {
        console.log(' Instrument List already populated')
      }

      if (store.state.instrumentBankList.length === 0) {
        // console.log('Init instrument Banks storage')
        let result = await InstrumentBankService.getAll()
        let list = await result.data
        // console.log('<< Init instrument bank List?>>')
        await store.dispatch('setInstrumentBankList', list)
        // console.log(this.$store.state.instrumentBankList)
      } else {
        console.log(' Instrument Bank List already populated')
        // console.log(this.$store.state.instrumentBankList)
      }

      if (store.state.presetList.length === 0) {
        // console.log('Init presets storage')
        let result = await PresetsService.getAll()
        let list = await result.data
        // console.log('<< Init preset List?>>')
        await store.dispatch('setPresetList', list)
        // console.log(this.$store.state.presetList)
      } else {
        console.log(' Preset List already populated')
      }

      if (store.state.gigSongList.length === 0) {
        console.log('Init gig song storage')
        let result = await GigsService.getGigSongs()
        let list = await result.data
        await store.dispatch('setGigSongList', list)
        console.log(list)
      } else {
        console.log(' Instrument List already populated')
      }
    } catch (ex) {
      console.log(ex)
    }
  },

  importAll (files) {
    try {
      files.keys().forEach(key => {
        const pathLong = files(key)
        const pathShort = key
        let id = -1
        if (pathShort.includes('image_')) {
          id = key.substring(8, 10)
          const payload = { 'id': parseInt(id, 10), 'url': pathLong }
          store.dispatch('setInstrumentImage', payload)
        }
      })
      // console.log(this.instrumentList)
    } catch (ex) {
      console.log(ex)
    }
  }
}
