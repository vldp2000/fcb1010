import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

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
    gigList: [],
    gigSongList: []
  },
  mutations: {
    setSongList (state, list) {
      state.songList = list
      console.log('<State>  songList populated ß!!!')
      // console.log(list)
    },
    addSong (state, song) {
      state.songList.push(song)
    },
    updateSong (state, song) {
      const item = state.songList.find(item => item.id === song.id)
      Object.assign(item, song)
    },

    setInstrumentList (state, instrumentList) {
      state.instrumentList = instrumentList
    },
    addInstrument (state, instrument) {
      state.instrumentList.push(instrument)
    },
    updateInstrument (state, instrument) {
      console.log('mutations - updateInstrument')
      const item = state.instrumentList.find(item => item.id === instrument.id)
      Object.assign(item, instrument)
    },

    setPresetList (state, presetList) {
      state.presetList = presetList
    },
    setGigList (state, gigList) {
      state.gigList = gigList
    },
    setGigSongList (state, gigSongList) {
      state.gigSongList = gigSongList
    }
  },

  actions: {
    setSongList ({ commit }, setSongList) {
      commit('setSongList', setSongList)
    },
    addSong ({ commit }, song) {
      commit('addSong', song)
    },
    updateSong ({ commit }, song) {
      console.log('action - updateSong')
      commit('updateSong', song)
    },

    setInstrumentList ({ commit }, setInstrumentList) {
      commit('setInstrumentList', setInstrumentList)
    },
    addInstrument ({ commit }, instrument) {
      commit('addInstrument', instrument)
    },
    updateInstrument ({ commit }, instrument) {
      console.log('action - updateInstrument')
      commit('updateInstrument', instrument)
    },

    setPresetList ({ commit }, presetList) {
      commit('setPresetList', presetList)
    },
    setGigList ({ commit }, setGigList) {
      commit('setGigList', setGigList)
    },
    setGigSongList ({ commit }, setGigSongList) {
      commit('setGigSongList', setGigSongList)
    }
  },

  getters: {
    songList: state => state.songList,
    instrumentList: state => state.instrumentList
  }
})
