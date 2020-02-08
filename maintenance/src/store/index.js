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
    initialisingIsInProgress: false,
    refreshSong: false,
    defaultPreset: {
      id: -1,
      refsong: -1,
      refsongprogram: -1,
      refinstrument: -1,
      refinstrumentbank: -1,
      refpreset: -1,
      volume: 0,
      pan: 0,
      muteflag: 0,
      reverbflag: 0,
      delayflag: 0,
      modeflag: 0,
      reverbvalue: 0,
      delayvalue: 0
    }
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
