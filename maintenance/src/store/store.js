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
    presetList: [],
    gigList: [],
    gigSongList: []
  },
  mutations: {
    setSongList (state, songList) {
      state.songList = songList
    },
    addSong (state, song) {
      state.songList.push(song)
    },
    updateSong (state, song) {
      console.log('mutations - updateSong')
      const item = state.songList.find(item => item.id === song.id)
      Object.assign(item, song)
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
    songList: state => state.songList
  }
})
