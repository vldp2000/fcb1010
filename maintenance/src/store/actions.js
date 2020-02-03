import * as types from './mutation-types'
import GigsService from '@/services/GigsService'
import SongsService from '@/services/SongsService'
import InstrumentsService from '@/services/InstrumentsService'
import InstrumentBankService from '@/services/InstrumentBankService'
import PresetsService from '@/services/PresetsService'

const config = require('@/config/config')
let clientInitialized = false
// let clientSubscribed = false

async function setInstrumentIcons (commit) {
  let result = await InstrumentsService.getInstrumentIcons(require.context('../assets/', false, /\.png$/))
  console.log(result)
  await commit(types.SET_INSTRUMENT_IMAGE, result)
}
async function initAllLists (commit, getters) {
  console.log('<<<Mutation. Init ALLS>>')
  if (!getters.gigList || getters.gigList.length === 0) {
    let list = await GigsService.getAll()
    console.log(list.length)
    if (list.length > 0) {
      console.log('action -  types.SET_GIGLIST')
      await commit(types.SET_GIGLIST, list)
    }
  }
  console.log(`getters. Lenght of gigList  = ${getters.gigList.length}`)

  if (!getters.songList || getters.songList.length === 0) {
    let list = await SongsService.getAll()
    if (list.length > 0) {
      console.log('action -  types.SET_SONGLIST')
      await commit(types.SET_SONGLIST, list)
    }
  }
  console.log(`getters. Lenght of songList  = ${getters.songList.length}`)

  console.log('populate -  instrumentList')
  if (!getters.instrumentList || getters.instrumentList.length === 0) {
    let list = await InstrumentsService.getAll()
    console.log(list)
    if (list.length > 0) {
      await commit(types.SET_INSTRUMENTLIST, list)
    }
  }
  console.log(`getters. Lenght of instrumentList  = ${getters.instrumentList.length}`)

  console.log('populate -  instrumentBANKList')
  if (!getters.instrumentBankList || getters.instrumentBankList.length === 0) {
    let list = await InstrumentBankService.getAll()
    console.log(list)
    if (list.length > 0) {
      await commit(types.SET_INSTRUMENTBANKLIST, list)
    } else {
      console.log('!!!  instrumentBankList is empty')
    }
  }
  console.log(`getters. Lenght of instrumentBankList  = ${getters.instrumentBankList.length}`)

  if (!getters.presetList || getters.presetList.length === 0) {
    let list = await PresetsService.getAll()
    if (list.length > 0) {
      await commit(types.SET_PRESETLIST, list)
    }
  }
  console.log(`getters. Lenght of presetList  = ${getters.presetList.length}`)

  if (!getters.gigsongList || getters.gigsongList.length === 0) {
    let list = await GigsService.getGigSongs()
    if (list.length > 0) {
      commit(types.SET_GIGSONGLIST, list)
    }
  }

  getters.gigList.forEach(gig => {
    if (!gig.songList || gig.songList === 0) {
      commit(types.POPULATE_GIG_SONGS, gig.id)
    }
  })

  await setInstrumentIcons(commit)
  commit(types.INIT_ALL)

  console.log('<<<Mutation. Finish Init ALL>>')
}

const actions = {
  initAll ({ commit, getters }, payload) {
    initAllLists(commit, getters)
  },
  //  Song List -----------------------------------------------------
  setSongList ({ commit }, payload) {
    commit(types.SET_SONGLIST, payload)
  },
  addSong ({ commit }, song) {
    commit(types.ADD_SONG, song)
  },
  updateSong ({ commit }, song) {
    // console.log('action - updateSong')
    commit(types.UPDATE_SONG, song)
  },
  async addSongItems ({ commit }, songId) {
    try {
      console.log('<<<<   action - addSongItems >>>>>>')
      let songPrograms = await SongsService.getSongItems(songId)
      console.log(songPrograms)
      commit(types.ADD_SONG_ITEMS, songPrograms)
    } catch (ex) {
      console.log(ex)
    }
  },

  updateSongProgramPreset ({ commit }, payload) {
    commit(types.UPDATE_SONGPRESET, payload)
  },

  //  Instrument List -----------------------------------------------------
  setInstrumentList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTLIST, payload)
  },
  addInstrument ({ commit }, instrument) {
    commit(types.ADD_INSTRUMENT, instrument)
  },
  updateInstrument ({ commit }, instrument) {
    // console.log('action - updateInstrument')
    commit(types.UPDATE_INSTRUMENT, instrument)
  },

  setInstrumentImage ({ commit }, payload) {
    console.log('action - setInstrumentImage')
    commit(types.SET_INSTRUMENT_IMAGE, payload)
  },

  //  Preset List -----------------------------------------------------
  setPresetList ({ commit }, payload) {
    // console.log('action - setPresetList')
    commit(types.SET_PRESETLIST, payload)
  },
  addPreset ({ commit }, preset) {
    commit(types.ADD_PRESET, preset)
  },
  updatePreset ({ commit }, preset) {
    // console.log('action - updatePreset')
    commit(types.UPDATE_PRESET, preset)
  },

  //  Instrument Bank List -----------------------------------------------------
  setInstrumentBankList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTBANKLIST, payload)
  },
  addInstrumentBank ({ commit }, instrumentBank) {
    commit(types.ADD_INSTRUMENTBANK, instrumentBank)
  },
  updateInstrumentBank ({ commit }, instrumentBank) {
    // console.log('action - updateInstrumentBank')
    commit(types.UPDATE_INSTRUMENTBANK, instrumentBank)
  },

  //  Gig List -----------------------------------------------------
  setGigList ({ commit }, payload) {
    commit(types.SET_GIGLIST, payload)
  },
  addGig ({ commit }, gig) {
    commit(types.ADD_GIG, gig)
  },
  updateGig ({ commit }, gig) {
    // console.log('action - updateGig')
    commit(types.UPDATE_GIG, gig)
  },

  //  populateGigSongs -----------------------------------------------------
  populateGigSongs ({ commit }, gigId) {
    // console.log('action - populateGigSongs')
    commit(types.POPULATE_GIG_SONGS, gigId)
  },

  //  Gig Song List -----------------------------------------------------
  setGigSongList ({ commit }, payload) {
    commit(types.SET_GIGSONGLIST, payload)
  },
  addGigSong ({ commit }, gigsong) {
    commit(types.ADD_GIGSONG, gigsong)
  },
  updateGigSong ({ commit }, gigsong) {
    // console.log('action - updateGigSong')
    commit(types.UPDATE_GIGSONG, gigsong)
  },
  //  Set current Song Id-----------------------------------------------------
  setCurrentGigId ({ commit }, id) {
    commit(types.SET_CURRENTGIG_ID, id)
    console.log('STORE. Set current Gig Id-------------------------------')
    console.log(id)
  },
  //  Set current Song Id-----------------------------------------------------
  setCurrentSongId ({ commit }, id) {
    commit(types.SET_CURRENTSONG_ID, id)
    console.log('STORE. Set current Song Id-------------------------------')
    console.log(id)
  },
  //  Set current Program Id-----------------------------------------------------
  setCurrentProgramMidiPedal ({ commit }, idx) {
    commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, idx)
  },

  //  Socket Io-----------------------------------------------------
  socketClientInitialize ({ commit }, payload) {
    console.log(';;;;;; socketClientIniotialize ;;;;;;;;')
    console.log(this._vm)
    console.log(this._vm.$socket)

    if (clientInitialized) return

    console.log(payload)

    this._vm.$socket.client.on('connect', function (data) {
      console.log('Socket Io-------- Connected')
      console.log(data)
    })

    this._vm.$socket.client.on(config.controllerProgramMessage, (data) => {
      console.log('-- Preset socket IO message')
      console.log(data)
      // this.setCurrentProgramMidiPedal({ commit }, data)
      commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, data)
      // this.$store.dispatch('setCurrentProgramMidiPedal', parseInt(data))
    })
    this._vm.$socket.client.on(config.controllerSongMessage, (data) => {
      console.log('-- Song socket IO message')
      console.log(data)
      // this.setCurrentSongId({ commit }, data)
      commit(types.SET_CURRENTSONG_ID, data)
      // this.$store.dispatch('setCurrentSongId', parseInt(data))
    })
    clientInitialized = true
  }

  /* socketClientSubscribe ({ commit }, payload) {
    console.log('----<<     socketClientSubscribe >------')
    if (clientSubscribed) return

    console.log(clientSubscribed)

    this._vm.$socket.$subscribe(config.controllerProgramMessage, payload => {
      console.log(config.controllerProgramMessage)
      console.log(payload)
    })
    this._vm.$socket.$subscribe(config.controllerSongMessage, payload => {
      console.log(config.controllerSongMessage)
      console.log(payload)
    })
    this._vm.$socket.$subscribe(config.controllerSyncMessage, payload => {
      console.log(config.controllerSyncMessage)
      console.log(payload)
    })
    clientSubscribed = true
  } */

}

export default actions
