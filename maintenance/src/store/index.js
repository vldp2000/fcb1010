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
    selectedGigId: -1,
    scheduledGigId: -1,
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
