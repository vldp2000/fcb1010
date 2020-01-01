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
    gigSongList: []
  },
  mutations: {
    [types.SET_SONGLIST] (state, songList) {
      state.songList = songList
      console.log('<State>  songList populated ß!!!')
      // console.log(list)
    },
    [types.ADD_SONG] (state, song) {
      state.songList.push(song)
    },
    [types.UPDATE_SONG] (state, song) {
      const item = state.songList.find(item => item.id === song.id)
      Object.assign(item, song)
    },

    [types.SET_INSTRUMENTLIST] (state, instrumentList) {
      state.instrumentList = instrumentList
    },
    [types.ADD_INSTRUMENT] (state, instrument) {
      state.instrumentList.push(instrument)
    },
    [types.UPDATE_INSTRUMENT] (state, instrument) {
      console.log('mutations - updateInstrument')
      const item = state.instrumentList.find(item => item.id === instrument.id)
      Object.assign(item, instrument)
    },
    [types.SET_INSTRUMENT_IMAGE] (state, { id, url }) {
      try {
        let item = state.instrumentList.find(item => item.id === id)
        if (!item.imageURL) {
          console.log('SET_INSTRUMENT_IMAGE ............----->>>')
          console.log(item)
          console.log(id)
          console.log(url)
          // item = { ...item, imageURL: url }
          Vue.set(item, 'imageURL', url)
          console.log(url)
        }
      } catch (ex) {
        console.log(ex)
      }
    },
    [types.SET_PRESETLIST] (state, presetList) {
      state.presetList = presetList
      console.log('<State>  presetList populated !!!')
      console.log(presetList)
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
      console.log('mutations - updateInstrumentBank')
      const item = state.instrumentBankList.find(item => item.id === instrumentBank.id)
      Object.assign(item, instrumentBank)
    },

    [types.SET_GIGLIST] (state, gigList) {
      state.gigList = gigList
      console.log('<State>  gigList populated ß!!!')
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
      console.log('<State>  gigsongList populated ß!!!')
      // console.log(list)
    },
    [types.ADD_GIGSONG] (state, gigsong) {
      state.gigsongList.push(gigsong)
    },
    [types.UPDATE_GIGSONG] (state, gigsong) {
      const item = state.gigsongList.find(item => item.id === gigsong.id)
      Object.assign(item, gigsong)
    }
  },

  actions: {
    setSongList ({ commit }, setSongList) {
      commit(types.SET_SONGLIST, setSongList)
    },
    addSong ({ commit }, song) {
      commit(types.ADD_SONG, song)
    },
    updateSong ({ commit }, song) {
      console.log('action - updateSong')
      commit(types.UPDATE_SONG, song)
    },

    setInstrumentList ({ commit }, setInstrumentList) {
      commit(types.SET_INSTRUMENTLIST, setInstrumentList)
    },
    addInstrument ({ commit }, instrument) {
      commit(types.ADD_INSTRUMENT, instrument)
    },
    updateInstrument ({ commit }, instrument) {
      console.log('action - updateInstrument')
      commit(types.UPDATE_INSTRUMENT, instrument)
    },

    setInstrumentImage ({ commit }, { id, url }) {
      console.log('action - setInstrumentImage')
      console.log(id)
      console.log(url)
      commit(types.SET_INSTRUMENT_IMAGE, { id, url })
    },
    setPresetList ({ commit }, setPresetList) {
      console.log('action - setPresetList')
      commit(types.SET_PRESETLIST, setPresetList)
    },
    addPreset ({ commit }, preset) {
      commit(types.ADD_PRESET, preset)
    },
    updatePreset ({ commit }, preset) {
      console.log('action - updatePreset')
      commit(types.UPDATE_PRESET, preset)
    },

    setInstrumentBankList ({ commit }, setInstrumentBankList) {
      commit(types.SET_INSTRUMENTBANKLIST, setInstrumentBankList)
    },
    addInstrumentBank ({ commit }, instrumentBank) {
      commit(types.ADD_INSTRUMENTBANK, instrumentBank)
    },
    updateInstrumentBank ({ commit }, instrumentBank) {
      console.log('action - updateInstrumentBank')
      commit(types.UPDATE_INSTRUMENTBANK, instrumentBank)
    },

    setGigList ({ commit }, setGigList) {
      commit(types.SET_GIGLIST, setGigList)
    },
    addGig ({ commit }, gig) {
      commit(types.ADD_GIG, gig)
    },
    updateGig ({ commit }, gig) {
      console.log('action - updateGig')
      commit('updateGig', gig)
    },

    setGigSongList ({ commit }, setGigSongList) {
      commit(types.SET_GIGSONGLIST, setGigSongList)
    },
    addGigSong ({ commit }, gigsong) {
      commit(types.ADD_GIGSONG, gigsong)
    },
    updateGigSong ({ commit }, gigsong) {
      console.log('action - updateGigSong')
      commit('updateGigSong', gigsong)
    }

  },

  getters: {
    songList: state => state.songList,
    instrumentList: state => state.instrumentList,
    presetList: state => state.presetList,
    instrumentBankList: state => state.instrumenBanktList,
    gigList: state => state.gigList,
    gigSongList: state => state.gigSongList
  }
})
