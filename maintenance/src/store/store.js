import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  plugins: [
    createPersistedState()
  ],
  state: {
    songList: [],
    currentSong: null,
    presetList: [],
    currentPreset: null,
    gigList: [],
    currentGig: null,
    gigSongList: [],
    currentGigSong: null
  },
  mutations: {
    setSongList (state, songList) {
      state.songList = songList
    },
    setCurrentSong (state, song) {
      state.currentSong = song
    },
    setPresetList (state, presetList) {
      state.presetList = presetList
    },
    setCurrentPreset (state, preset) {
      state.currentPreset = preset
    },
    setGigList (state, gigList) {
      state.gigList = gigList
    },
    setCurrentGig (state, gig) {
      state.currentGig = gig
    },
    setGigSongList (state, gigSongList) {
      state.gigSongList = gigSongList
    },
    setCurrentGigSong (state, gigSong) {
      state.currentGigSong = gigSong
    }
  },

  actions: {
    setSongList ({ commit }, setSongList) {
      commit('setSongList', setSongList)
    },
    setCurrentSong ({ commit }, song) {
      commit('setCurrentSong', song)
    },
    setPresetList ({ commit }, presetList) {
      commit('setPresetList', presetList)
    },
    setCurrentPreset ({ commit }, preset) {
      commit('setCurrentPreset', preset)
    },
    setGigList ({ commit }, setGigList) {
      commit('setGigList', setGigList)
    },
    setCurrentGig ({ commit }, gig) {
      commit('setCurrentGig', gig)
    },
    setGigSongList ({ commit }, setGigSongList) {
      commit('setGigSongList', setGigSongList)
    },
    setCurrentGigSong ({ commit }, gigSong) {
      commit('setCurrentGigSong', gigSong)
    }
  },
  getters: {
    songList: state => state.songList
  }
})
