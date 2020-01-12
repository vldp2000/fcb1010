import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

import * as types from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  // plugins: [
  //   createPersistedState()
  // ],
  state: {
    songList: [],
    instrumentList: [],
    presetList: [],
    instrumentBankList: [],
    gigList: [],
    gigSongList: [],
    currentSongId: 0,
    currentProgramId: 0

  },
  mutations: {
    [types.SET_SONGLIST] (state, songList) {
      state.songList = songList
      // console.log('<State>  songList populated ß!!!')
      // console.log(list)
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

    [types.ADD_SONG_ITEMS] (state, payload) {
      try {
        let song = state.songList.find(sn => sn.id === payload.id)
        if (!song.programList) {
          // console.log('types.ADD_SONG_ITEMS -->>')
          // console.log(payload.id)
          console.log(payload.programs)
          Vue.set(song, 'programList', payload.programs)
        }
      } catch (ex) {
        console.log('types.ADD_SONG_ITEMS] (state, { id, programs })')
        console.log(ex)
      }
    },
    [types.SET_INSTRUMENTLIST] (state, instrumentList) {
      state.instrumentList = instrumentList
    },
    [types.ADD_INSTRUMENT] (state, instrument) {
      state.instrumentList.push(instrument)
    },
    [types.UPDATE_INSTRUMENT] (state, instrument) {
      // console.log('mutations - updateInstrument')
      const item = state.instrumentList.find(item => item.id === instrument.id)
      Object.assign(item, instrument)
    },
    [types.SET_INSTRUMENT_IMAGE] (state, { id, url }) {
      try {
        let item = state.instrumentList.find(item => item.id === id)
        if (!item.imageURL) {
          // console.log('SET_INSTRUMENT_IMAGE ............----->>>')
          Vue.set(item, 'imageURL', url)
          // console.log(url)
        }
      } catch (ex) {
        console.log(ex)
      }
    },
    [types.SET_PRESETLIST] (state, presetList) {
      state.presetList = presetList
      // console.log('<State>  presetList populated !!!')
      // console.log(presetList)
    },
    [types.ADD_PRESET] (state, preset) {
      state.presetList.push(preset)
    },
    [types.UPDATE_PRESET] (state, preset) {
      const item = state.presetList.find(item => item.id === preset.id)
      Object.assign(item, preset)
    },

    [types.SET_INSTRUMENTBANKLIST] (state, instrumentBankList) {
      state.instrumentBankList = instrumentBankList
    },
    [types.ADD_INSTRUMENTBANK] (state, instrumentBank) {
      state.instrumentBankList.push(instrumentBank)
    },
    [types.UPDATE_INSTRUMENTBANK] (state, instrumentBank) {
      // console.log('mutations - updateInstrumentBank')
      const item = state.instrumentBankList.find(item => item.id === instrumentBank.id)
      Object.assign(item, instrumentBank)
    },

    [types.SET_GIGLIST] (state, gigList) {
      state.gigList = gigList
      // console.log('<State>  gigList populated ß!!!')
      // console.log(list)
    },
    [types.ADD_GIG] (state, gig) {
      state.gigList.push(gig)
    },
    [types.UPDATE_GIG] (state, gig) {
      const item = state.gigList.find(item => item.id === gig.id)
      Object.assign(item, gig)
    },

    [types.SET_GIGSONGLIST] (state, gigsongList) {
      state.gigsongList = gigsongList
      // console.log('<State>  gigsongList populated ß!!!')
      // console.log(list)
    },
    [types.ADD_GIGSONG] (state, gigsong) {
      state.gigsongList.push(gigsong)
    },
    [types.UPDATE_GIGSONG] (state, gigsong) {
      const item = state.gigsongList.find(item => item.id === gigsong.id)
      Object.assign(item, gigsong)
    },

    [types.SET_CURRENTSONG_ID] (state, id) {
      state.currentSongId = id
    },
    [types.SET_CURRENTPROGRAM_ID] (state, id) {
      state.currentProgramId = id
    }
  },

  actions: {
    //  Song List -----------------------------------------------------
    setSongList ({ commit }, setSongList) {
      commit(types.SET_SONGLIST, setSongList)
    },
    addSong ({ commit }, song) {
      commit(types.ADD_SONG, song)
    },
    updateSong ({ commit }, song) {
      // console.log('action - updateSong')
      commit(types.UPDATE_SONG, song)
    },
    addSongItems ({ commit }, payload) {
      try {
        // console.log('action - addSongItems')
        // console.log(payload.id)
        // console.log(payload.programs)
        commit(types.ADD_SONG_ITEMS, payload)
      } catch (ex) {
        console.log(ex)
      }
    },

    //  Instrument List -----------------------------------------------------
    setInstrumentList ({ commit }, setInstrumentList) {
      commit(types.SET_INSTRUMENTLIST, setInstrumentList)
    },
    addInstrument ({ commit }, instrument) {
      commit(types.ADD_INSTRUMENT, instrument)
    },
    updateInstrument ({ commit }, instrument) {
      // console.log('action - updateInstrument')
      commit(types.UPDATE_INSTRUMENT, instrument)
    },

    setInstrumentImage ({ commit }, { id, url }) {
      // console.log('action - setInstrumentImage')
      // console.log(id)
      // console.log(url)
      commit(types.SET_INSTRUMENT_IMAGE, { id, url })
    },

    //  Preset List -----------------------------------------------------
    setPresetList ({ commit }, setPresetList) {
      // console.log('action - setPresetList')
      commit(types.SET_PRESETLIST, setPresetList)
    },
    addPreset ({ commit }, preset) {
      commit(types.ADD_PRESET, preset)
    },
    updatePreset ({ commit }, preset) {
      // console.log('action - updatePreset')
      commit(types.UPDATE_PRESET, preset)
    },

    //  Instrument Bank List -----------------------------------------------------
    setInstrumentBankList ({ commit }, setInstrumentBankList) {
      commit(types.SET_INSTRUMENTBANKLIST, setInstrumentBankList)
    },
    addInstrumentBank ({ commit }, instrumentBank) {
      commit(types.ADD_INSTRUMENTBANK, instrumentBank)
    },
    updateInstrumentBank ({ commit }, instrumentBank) {
      // console.log('action - updateInstrumentBank')
      commit(types.UPDATE_INSTRUMENTBANK, instrumentBank)
    },

    //  Gig List -----------------------------------------------------
    setGigList ({ commit }, setGigList) {
      commit(types.SET_GIGLIST, setGigList)
    },
    addGig ({ commit }, gig) {
      commit(types.ADD_GIG, gig)
    },
    updateGig ({ commit }, gig) {
      // console.log('action - updateGig')
      commit(types.UPDATE_GIG, gig)
    },

    //  Gig Song List -----------------------------------------------------
    setGigSongList ({ commit }, setGigSongList) {
      commit(types.SET_GIGSONGLIST, setGigSongList)
    },
    addGigSong ({ commit }, gigsong) {
      commit(types.ADD_GIGSONG, gigsong)
    },
    updateGigSong ({ commit }, gigsong) {
      // console.log('action - updateGigSong')
      commit(types.UPDATE_GIGSONG, gigsong)
    },
    //  Set current Song Id-----------------------------------------------------
    setCurrentSongId ({ commit }, id) {
      commit(types.SET_CURRENTSONG_ID, id)
    },
    //  Set current Program Id-----------------------------------------------------
    setCurrentProgramId ({ commit }, id) {
      commit(types.SET_CURRENTPROGRAM_ID_ID, id)
    }

  },

  getters: {
    songList: state => state.songList,
    instrumentList: state => state.instrumentList,
    presetList: state => state.presetList,
    instrumentBankList: state => state.instrumenBanktList,
    gigList: state => state.gigList,
    gigSongList: state => state.gigSongList,
    // getPresetById: state => id => state.presetList.find(preset => preset.id === id)
    getPresetById (state) {
      return id => state.presetList.filter(item => {
        return item.id === id
      })
    },
    currentSongId: state => state.currentSongId,
    currentProgramId: state => state.currentProgramId
  }
})
