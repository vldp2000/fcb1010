import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'

// import * as types from './mutation-types'
// import _sortBy from 'lodash/sortBy'
// import _pickBy from 'lodash/pickBy'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

/* const messages = {
  state: {
    messages: []
  },

  mutations: {
    [types.SOCKET_CONTROLLER_PROGRAM_MESSAGE] (state, message) {
      state.messages.push(message)
    },
    [types.SOCKET_CONTROLLER_SONG_MESSAGE] (state, message) {
      state.messages.push(message)
    },
    [types.SOCKET_CONTROLLER_SYNC_MESSAGE] (state, message) {
      state.messages.push(message)
    },
    [types.SOCKET_VIEW_PROGRAM_MESSAGE] (state, message) {
      state.messages.push(message)
    },
    [types.SOCKET_VIEW_SONG_MESSAGE] (state, message) {
      state.messages.push(message)
    }
  },

  actions: {
    socket_controllerProgramMessage () {
      console.log('<--> action socket_controllerProgramMessage')
    },
    socket_controllerSongMessage () {
      console.log('<--> action socket_controllerSongMessage')
    },
    socket_controllerSyncMessage () {
      console.log('<--> action socket_controllerSyncMessage')
    },
    socket_viewProgramMessage () {
      console.log('<--> action socket_viewProgramMessage')
    },
    socket_viewSongMessage () {
      console.log('<--> action socket_viewSongMessage')
    }
  }
}

const notifications = {
  state: {
    notifications: []
  },
  mutations: {
    [types.SOCKET_CONTROLLER_PROGRAM_MESSAGE] (state, message) {
      state.notifications.push({ type: 'message', payload: message })
    },
    [types.SOCKET_CONTROLLER_SONG_MESSAGE] (state, message) {
      state.notifications.push({ type: 'message', payload: message })
    },
    [types.SOCKET_CONTROLLER_SYNC_MESSAGE] (state, message) {
      state.notifications.push({ type: 'message', payload: message })
    },
    [types.SOCKET_VIEW_PROGRAM_MESSAGE] (state, message) {
      state.notifications.push({ type: 'message', payload: message })
    },
    [types.SOCKET_VIEW_SONG_MESSAGE] (state, message) {
      state.notifications.push({ type: 'message', payload: message })
    }
  }
}
*/

const Store = new Vuex.Store({
  strict: true,
  // plugins: [
  //   createPersistedState()
  // ],
  namespaced: true,
  state: {
    songList: [],
    instrumentList: [],
    presetList: [],
    instrumentBankList: [],
    gigList: [],
    gigSongList: [],
    currentSongId: 0,
    currentProgramMidiPedal: 0,
    currentGigId: 0,
    allInitialized: false,
    refreshSong: false
  },
  actions,
  mutations,
  getters
  // modules: {
  //   messages,
  //   notifications
  // }
})
export default Store
