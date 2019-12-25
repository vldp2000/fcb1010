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
    token: null,
    user: null,
    isUserLoggedIn: true,
    currentSong: null
  },
  mutations: {
    setToken (state, token) {
      state.token = null
      state.isUserLoggedIn = true
    },
    setUser (state, user) {
      state.user = null
    },
    setCurrentSong (state, song) {
      state.currentSong = song
    }
  },
  actions: {
    setToken ({ commit }, token) {
      commit('setToken', null)
    },
    setUser ({ commit }, user) {
      commit('setUser', null)
    },
    setCurrentSong ({ commit }, song) {
      commit('setCurrentSong', song)
    }
  }
})
