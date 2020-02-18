import Vue from 'vue'
import * as types from './mutation-types'
// import _sortBy from 'lodash/sortBy'
// import _pickBy from 'lodash/pickBy'

const mutations = {
  [types.INIT_ALL] (state) {
    state.allInitialized = true
  },
  [types.INIT_INPROGRESS] (state, value) {
    state.initialisingIsInProgress = value
  },

  [types.SET_SONGLIST] (state, songList) {
    state.songList = songList
    // Vue.$log.debug('<State>  songList populated!!!')
    // Vue.$log.debug(songList)
  },
  [types.ADD_SONG] (state, song) {
    state.songList.push(song)
  },
  [types.UPDATE_SONG] (state, song) {
    const item = state.songList.find(item => item.id === song.id)
    Object.assign(item, song)
    // JSON.parse(JSON.stringify(obj)); // <- could be a better option to make a deep copy of an object
    // people recon that Object.assign does the shallow copy
  },
  [types.REFRESH_SONG] (state, payload) {
    state.refreshSong = !state.refreshSong
  },

  [types.ADD_SONG_ITEMS] (state, songPrograms) {
    Vue.$log.debug('Mutation... types.ADD_SONG_ITEMS ....')
    try {
      let song = state.songList.find(sn => sn.id === songPrograms.songId)
      // Vue.$log.debug(` add itens to song list -> ${song.name}`)
      if (song && !song.programList) {
        Vue.set(song, 'programList', songPrograms.programs)
      }
    } catch (ex) {
      Vue.$log.debug('Error. Mutation [types.ADD_SONG_ITEMS] (state, { id, programs })')
      Vue.$log.debug(ex)
    }
  },
  [types.UPDATE_SONGPROGRAMPRESET] (state, payload) {
    try {
      console.log(payload)
      let song = state.songList.find(sn => sn.id === payload.refsong)
      console.log(song)
      let program = song.programList.find(pr => pr.id === payload.refsongprogram)
      console.log(program)
      let preset = program.presetList.find(pr => pr.id === payload.id)
      console.log(preset)

      if (preset) {
        // Vue.$log.debug('types.UPDATE_SONGPROGRAMPRESET -->>')
        // Vue.$log.debug(payload.id)
        // Vue.$log.debug(payload)
        preset.refpreset = payload.refpreset
        preset.volume = payload.volume
        preset.pan = payload.pan
        preset.muteflag = payload.muteflag
        preset.reverbflag = payload.reverbflag
        preset.delayflag = payload.delayflag
        preset.modeflag = payload.modeflag
        preset.reverbvalue = payload.reverbvalue
        preset.delayvalue = payload.delayvalue
        console.log(song)
      }
    } catch (ex) {
      Vue.$log.error('[types.UPDATE_SONGPROGRAMPRESET] (state, payload)')
      Vue.$log.error(ex)
    }
  },

  [types.UPDATE_SONGPROGRAM] (state, songProgram) {
    try {
      let song = state.songList.find(sn => sn.id === songProgram.refsong)
      let program = song.programList.find(pr => pr.id === songProgram.id)
      program.tytle = songProgram.tytle
      Vue.$log.debug(songProgram.tytle)
    } catch (ex) {
      Vue.$log.error('[types.UPDATE_SONGPROGRAM] (state, payload)')
      Vue.$log.error(ex)
    }
  },

  [types.SET_INSTRUMENTLIST] (state, instrumentList) {
    state.instrumentList = instrumentList
  },
  [types.ADD_INSTRUMENT] (state, instrument) {
    state.instrumentList.push(instrument)
  },
  [types.UPDATE_INSTRUMENT] (state, instrument) {
    // Vue.$log.debug('mutations - updateInstrument')
    const item = state.instrumentList.find(item => item.id === instrument.id)
    Object.assign(item, instrument)
  },
  [types.SET_INSTRUMENT_IMAGE] (state, payload) {
    try {
      // Vue.$log.debug('SET_INSTRUMENT_IMAGE ............----->>>')
      // Vue.$log.debug(payload)
      payload.forEach(item => {
        let instrument = state.instrumentList.find(i => i.id === item.id)
        if (!instrument.imageURL) {
          Vue.set(instrument, 'imageURL', item.url)
          // Vue.$log.debug(url)
        }
      })
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },
  [types.SET_PRESETLIST] (state, presetList) {
    state.presetList = presetList
    // Vue.$log.debug('<State>  presetList populated !!!')
    // Vue.$log.debug(presetList)
  },
  [types.ADD_PRESET] (state, preset) {
    state.presetList.push(preset)
  },
  [types.UPDATE_PRESET] (state, preset) {
    const item = state.presetList.find(item => item.id === preset.id)
    Object.assign(item, preset)
  },

  [types.SET_INSTRUMENTBANKLIST] (state, instrumentBankList) {
    // Vue.$log.debug('mutations - SET InstrumentBank')
    state.instrumentBankList = instrumentBankList
  },
  [types.ADD_INSTRUMENTBANK] (state, instrumentBank) {
    state.instrumentBankList.push(instrumentBank)
  },
  [types.UPDATE_INSTRUMENTBANK] (state, instrumentBank) {
    // Vue.$log.debug('mutations - updateInstrumentBank')
    const item = state.instrumentBankList.find(item => item.id === instrumentBank.id)
    Object.assign(item, instrumentBank)
  },

  [types.SET_GIGLIST] (state, gigList) {
    state.gigList = gigList
    // Vue.$log.debug('<State>  gigList populated ß!!!')
    // Vue.$log.debug(gigList)
    // Vue.$log.debug(state.gigList)
  },

  [types.ADD_GIG] (state, gig) {
    state.gigList.push(gig)
  },

  [types.UPDATE_GIG] (state, gig) {
    const item = state.gigList.find(item => item.id === gig.id)
    Object.assign(item, gig)
  },

  [types.POPULATE_GIG_SONGS] (state, payload) {
    console.log('>>>>>>----types.POPULATE_GIG_SONGS -->>')
    try {
      console.log(`>>>  gig Id = ${payload.gigId}`)
      let gig = state.gigList.find(item => item.id === payload.gigId)
      console.log(gig)
      Vue.set(gig, 'songList', payload.songs)
      console.log(gig)
      console.log('--------------')
    } catch (ex) {
      Vue.$log.error('types.POPULATE_GIG_SONGS ')
      Vue.$log.error(ex)
    }
  },

  [types.SET_GIGSONGLIST] (state, gigSongList) {
    state.gigSongList = gigSongList
    // Vue.$log.debug('<State>  gigSongList populated ß!!!')
    // Vue.$log.debug(list)
  },
  [types.ADD_GIGSONG] (state, gigsong) {
    state.gigSongList.push(gigsong)
  },
  [types.UPDATE_GIGSONG] (state, gigsong) {
    const item = state.gigSongList.find(item => item.id === gigsong.id)
    Object.assign(item, gigsong)
  },

  [types.SET_CURRENTGIG_ID] (state, id) {
    state.currentGigId = id
  },
  [types.SET_CURRENTSONG_ID] (state, id) {
    let song = state.songList.find(s => s.id === id)
    if (song) {
      state.currentSongId = id
    } else {
      state.currentSongId = -1
    }
    Vue.$log.debug(`> Mutation SET_CURRENTSONG_ID >> ${id}`)
  },
  [types.SET_CURRENT_PROGRAMMIDIPEDAL] (state, idx) {
    state.currentProgramMidiPedal = idx
  }
}
export default mutations
