import * as types from './mutation-types'
import GigsService from '@/services/GigsService'
import SongsService from '@/services/SongsService'
import InstrumentsService from '@/services/InstrumentsService'
import InstrumentBankService from '@/services/InstrumentBankService'
import PresetsService from '@/services/PresetsService'
import Vue from 'vue'
import _sortBy from 'lodash/sortBy'

const config = require('@/config/config')
let clientInitialized = false
// let clientSubscribed = false

async function setInstrumentIcons (commit) {
  let result = await InstrumentsService.getInstrumentIcons(require.context('../assets/', false, /\.png$/))
  // Vue.$log.debug(result)
  await commit(types.SET_INSTRUMENT_IMAGE, result)
}

async function validateSong (song) {
  // console.log(`-- validateSong ${song}`)
  const pList = ['A', 'B', 'C', 'D']
  let i = 0

  if (song.programList || song.programList.length !== 4) {
    return false
  }

  for (let p of pList) {
    const program = song.programList[i]
    if (program.name !== p || program.refsong !== song.id || program.midipedal !== i + 1 || !program.presetList || program.presetList.length !== 4) {
      // console.log(`-- Program ${program}`)
      return false
    }
    let instList = []
    let instBankList = []
    let presetList = []
    for (let preset of program.presetList) {
      if (preset.refsong !== song.id || preset.refsongprogram !== program.id) {
        // console.log(`-- Preset ${preset}`)
        return false
      }
      if (instList.includes(preset.refinstrument)) return false
      instList.push(preset.refinstrument)

      if (instBankList.includes(preset.refinstrumentbank)) return false
      instBankList.push(preset.refinstrumentbank)

      if (presetList.includes(preset.refpreset)) return false
      presetList.push(preset.refpreset)
    }
    i = i + 1
  }
  return true
}
// ---addNewSong-------
async function addNewSong (getters, song) {
  // Vue.$log.debug('1. __ New SOng__')
  song.id = await SongsService.getId()

  Vue.set(song, 'programList', [])
  const pList = ['A', 'B', 'C', 'D']
  let i = 1
  let j = 1
  for (let p of pList) {
    let pr = {
      'id': i,
      'name': p,
      'midipedal': i,
      'refsong': song.id,
      'tytle': p,
      'presetList': []
    }

    // to simplify the creating new song preset there is the default setup enforsed
    // each Instrument has the InstrumentBank and Preset records
    // with the same Ids as instrumnent.id

    for (let instrument of getters.instrumentList) {
      let preset = {
        'id': j,
        'refsong': song.id,
        'refsongprogram': pr.id,
        'refinstrument': instrument.id,
        'refinstrumentbank': instrument.id, // todo
        'refpreset': instrument.id, // todo
        'volume': 0,
        'pan': 64,
        'muteflag': 0,
        'reverbflag': 0,
        'delayflag': 0,
        'modeflag': 0,
        'reverbvalue': 0,
        'delayvalue': 0
      }
      pr.presetList.push(preset)
      j = j + 1
      // let newPreset =
      // await SongsService.postSongPreset(preset)
      // Vue.$log.debug('3. ---new preset -------', newPreset)
    }
    song.programList.push(pr)
    i = i + 1
  }
  const newSong = await SongsService.putSong(song)
  Vue.$log.debug(' --- new song ---- ', newSong)
  return newSong
}

async function updateGigSongCollection (getters, gig) {
  if (gig && gig.shortSongList && gig.shortSongList.length > 0) {
    let songs = []
    for (let item of gig.shortSongList) {
      let song = await getters.songList.find(s => s.id === item.id)
      if (song) {
        await songs.push(song)
      } else {
        // console.log(` !!!!!!! --- no song ${item.id} `)
      }
    }
    return songs
  } else {
    // console.log('gggopppppaaaaaaaaa   00000000000 ')
    return []
  }
}
async function initializeAllLists (commit, getters) {
  // console.log('----------- load All ---- New---')
  await commit(types.INIT_INPROGRESS, true)

  if (!getters.songList || getters.songList.length === 0) {
    let songs = await SongsService.getAllData()
    // console.log(songs)
    if (songs.length > 0) {
      // Vue.$log.debug('action -  types.SET_SONGLIST')
      for (let song of songs) {
        if (!validateSong(song)) {
          Vue.$log.error(`Error. Song Invalid ${song.id}`)
        }
      }
      await commit(types.SET_SONGLIST, songs)
    }
    // console.log('----songs ---')
  }

  if (!getters.instrumentList || getters.instrumentList.length === 0) {
    let instruments = await InstrumentsService.getAllData()
    if (instruments.length > 0) {
      await commit(types.SET_INSTRUMENTLIST, instruments)
    }
    // console.log(instruments)
    // console.log('----instruments ---')
  }

  if (!getters.instrumentBankList || getters.instrumentBankList.length === 0) {
    let instrumentBanks = await InstrumentBankService.getAllData()
    if (instrumentBanks.length > 0) {
      await commit(types.SET_INSTRUMENTBANKLIST, instrumentBanks)
    }
    // console.log(instrumentBanks)
    // console.log('----instrumentBanks ---')
  }

  if (!getters.presetList || getters.presetList.length === 0) {
    let presets = await PresetsService.getAllData()
    // console.log(presets)
    if (presets.length > 0) {
      let sortedList = await _sortBy(presets, 'name')
      // console.log(sortedList)
      await commit(types.SET_PRESETLIST, sortedList)
    }
    // console.log(presets)
    // console.log('----presets ---')
  }

  // console.log(getters.gigList)
  if (!getters.gigList || getters.gigList.length === 0) {
    let gigs = await GigsService.getAllData()
    if (gigs.length > 0) {
      for (let gig of gigs) {
        // console.log(gig)
        if (!gig.shortSongList) {
          Vue.set(gig, 'shortSongList', [])
        } else {
          let sortedList = await _sortBy(gig.shortSongList, 'sequencenumber')
          Vue.set(gig, 'shortSongList', sortedList)
        }
        if (!gig.songList) {
          Vue.set(gig, 'songList', [])
        }
      }
      // Vue.$log.debug('action -  types.SET_GIGLIST')
      await commit(types.SET_GIGLIST, gigs)
    }
    // console.log('----gig---')
  }

  // console.log(' ----- before POPULATE_GIG_SONGS')
  // console.log(getters.gigList.length)

  for (let gig of getters.gigList) {
    // console.log(gig)
    if (gig.shortSongList && gig.shortSongList.length > 0) {
      const songs = await updateGigSongCollection(getters, gig)
      const payload = { 'gigId': gig.id, 'songs': songs }
      await commit(types.POPULATE_GIG_SONGS, payload)
    }
  }

  const gigId = await GigsService.getScheduledGigId()
  await commit(types.SET_SCHEDULEDGIG_ID, gigId)
  // console.log(' ----- SET_SCHEDULEDGIG_ID --', gigId)
  // console.log(getters.gigList)
  await setInstrumentIcons(commit)
  //  Init Is Complete
  commit(types.INIT_ALL)
  commit(types.INIT_INPROGRESS, false)
  Vue.$log.debug('<<<Mutation. Finish Init ALL>>')
}

// ----------A C T I O N S--------------------

const actions = {
  initAllLists ({ commit, getters }, payload) {
    // console.log('----------- load All ---- start---')
    initializeAllLists(commit, getters)
    // console.log('----------- load All ---- end---')
  },

  // initAll ({ commit, getters }, payload) {
  //   initAllLists(commit, getters)
  // },
  //  Song List -----------------------------------------------------
  setSongList ({ commit }, payload) {
    commit(types.SET_SONGLIST, payload)
  },

  addSong ({ commit, getters }, song) {
    const newSong = addNewSong(getters, song)
    commit(types.ADD_SONG, newSong)
  },

  updateSong ({ commit }, song) {
    // Vue.$log.debug('action - updateSong')
    SongsService.putSong(song)
    commit(types.UPDATE_SONG, song)
  },
  refreshSong ({ commit }, songId) {
    // Vue.$log.debug('action - updateSong')
    commit(types.REFRESH_SONG, songId)
  },
  async addSongItems ({ commit }, songId) {
    try {
      // Vue.$log.debug('<<<<   action - addSongItems >>>>>>')
      let songPrograms = await SongsService.getSongItems(songId)
      // Vue.$log.debug(songPrograms)
      await commit(types.ADD_SONG_ITEMS, songPrograms)
      await commit(types.REFRESH_SONG, songId)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },
  updateSongProgram ({ commit }, songProgram) {
    // SongsService.putSongProgram(songProgram)
    commit(types.UPDATE_SONGPROGRAM, songProgram)
  },

  updateSongProgramPreset ({ commit }, songPreset) {
    // Vue.$log.debug('--- action >> updateSongProgramPreset')
    // SongsService.putSongPreset(songPreset)
    // Vue.$log.debug('--- action >> SongsService.putSongPreset')
    // console.log(songPreset)
    commit(types.UPDATE_SONGPROGRAMPRESET, songPreset)
    Vue.$log.debug('--- action >> commit(types.UPDATE_SONGPROGRAMPRESET')
  },

  //  Instrument List -----------------------------------------------------
  setInstrumentList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTLIST, payload)
  },
  async addInstrument ({ commit }, instrument) {
    const id = await InstrumentsService.getId()
    // console.log(id)
    instrument.id = id
    await InstrumentsService.put(instrument)
    commit(types.ADD_INSTRUMENT, instrument)
  },
  updateInstrument ({ commit }, instrument) {
    // Vue.$log.debug('action - updateInstrument')
    InstrumentsService.put(this.instrument)
    commit(types.UPDATE_INSTRUMENT, instrument)
  },

  setInstrumentImage ({ commit }, payload) {
    Vue.$log.debug('action - setInstrumentImage')
    commit(types.SET_INSTRUMENT_IMAGE, payload)
  },

  //  Preset List -----------------------------------------------------
  setPresetList ({ commit }, payload) {
    // Vue.$log.debug('action - setPresetList')
    commit(types.SET_PRESETLIST, payload)
  },
  async addPreset ({ commit }, preset) {
    const id = await PresetsService.getId()
    // console.log(id)
    preset.id = id
    await PresetsService.put(preset)
    await commit(types.ADD_PRESET, preset)
    // console.log(preset)
  },
  updatePreset ({ commit }, preset) {
    // Vue.$log.debug('action - updatePreset')
    PresetsService.put(preset)
    commit(types.UPDATE_PRESET, preset)
  },

  //  Instrument Bank List -----------------------------------------------------
  setInstrumentBankList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTBANKLIST, payload)
  },
  async addInstrumentBank ({ commit }, instrumentBank) {
    const id = await InstrumentBankService.getId()
    // console.log(id)
    instrumentBank.id = id
    await InstrumentBankService.put(instrumentBank)
    commit(types.ADD_INSTRUMENTBANK, instrumentBank)
  },
  updateInstrumentBank ({ commit }, instrumentBank) {
    // Vue.$log.debug('action - updateInstrumentBank')
    InstrumentBankService.put(instrumentBank)
    commit(types.UPDATE_INSTRUMENTBANK, instrumentBank)
  },

  //  Gig List -----------------------------------------------------
  setGigList ({ commit }, payload) {
    commit(types.SET_GIGLIST, payload)
  },
  async addGig ({ commit }, gig) {
    const id = await GigsService.getId()
    gig.id = id
    // console.log(gig)
    await GigsService.putGig(gig)

    commit(types.ADD_GIG, gig)
  },
  updateGig ({ commit }, gig) {
    // Vue.$log.debug('action - updateGig')
    GigsService.putGig(gig)
    commit(types.UPDATE_GIG, gig)
  },

  //  populateGigSongs -----------------------------------------------------
  populateGigSongs ({ commit }, payload) {
    // Vue.$log.debug('action - populateGigSongs')
    commit(types.POPULATE_GIG_SONGS, payload)
  },

  //  Gig Song List -----------------------------------------------------
  setGigSongList ({ commit }, payload) {
    commit(types.SET_GIGSONGLIST, payload)
  },
  addGigSong ({ commit }, gigsong) {
    commit(types.ADD_GIGSONG, gigsong)
  },
  updateGigSong ({ commit }, gigsong) {
    // Vue.$log.debug('action - updateGigSong')
    commit(types.UPDATE_GIGSONG, gigsong)
  },

  resetGigSongs ({ commit, getters }, payload) { // {}  gigId, songList)
    try {
      // console.log('=========================')
      // console.log(payload.gig)
      // console.log(payload.songList)
      // console.log('=========================')

      var gig = Object.assign({}, payload.gig)
      if (!gig.shortSongList) {
        Vue.set(gig, 'shortSongList', [])
      } else {
        gig.shortSongList = []
      }
      let i = 1
      for (let item of payload.songList) {
        const song = { 'id': item.id, 'sequencenumber': i }
        gig.shortSongList.push(song)
        i = i + 1
      }
      GigsService.putGig(gig)

      gig.songList = []
      for (let item of payload.songList) {
        const song = getters.songList.find(s => s.id === item.id)
        gig.songList.push(song)
      }
      // console.log(gig)
      commit(types.UPDATE_GIG, gig)
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  //  Set current Gig Id-----------------------------------------------------
  setSelectedGigId ({ commit }, id) {
    commit(types.SET_SELECTEDGIG_ID, id)
  },

  //  setGigAsScheduled -----------------------------------------------------
  setGigAsScheduled ({ commit }, id) {
    GigsService.saveScheduledGigId(id)
    commit(types.SET_SCHEDULEDGIG_ID, id)
  },

  //  Set current Song Id-----------------------------------------------------
  setCurrentSongId ({ commit }, id) {
    commit(types.SET_CURRENTSONG_ID, id)
    // Vue.$log.debug('STORE. Set current Song Id-------------------------------
    // Vue.$log.debug(id)
  },
  //  Set current Program Id-----------------------------------------------------
  setCurrentProgramMidiPedal ({ commit }, idx) {
    commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, idx)
  },

  //  Socket Io----Message Related methods----------------------------------------
  selectSong ({ commit }, id) {
    this._vm.$socket.client.emit(config.viewSongMessage, id)
  },

  selectSongProgram ({ commit }, idx) {
    this._vm.$socket.client.emit(config.viewProgramMessage, idx)
  },

  sendChangePresetVolumeMessage ({ commit }, payload) {
    // console.log(payload)
    this._vm.$socket.client.emit(config.viewPresetVolMessage, payload)
  },

  //  Socket Io.  VIEW_EDIT_MODE_MESSAGE---------------------------------------
  sendEditMode ({ commit }, editFlag) {
    this._vm.$socket.client.emit(config.viewEdtModeMessage, editFlag)
    Vue.$log.debug('>~>~> VIEW_EDIT_MODE_MESSAGE ${editFlag}')
  },

  //  Socket Client Initialize
  socketClientInitialize ({ commit }, payload) {
    Vue.$log.debug(';;>> socketClientInitialize <<;;')
    Vue.$log.debug(this._vm)
    Vue.$log.debug(this._vm.$socket)

    if (clientInitialized) return

    // Vue.$log.debug(payload)

    this._vm.$socket.client.on('connect', function (data) {
      // Vue.$log.debug('Socket Io-------- Connected')
      // Vue.$log.debug(data)
    })

    this._vm.$socket.client.on(config.controllerProgramMessage, (data) => {
      const idx = parseInt(data)
      commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, idx)
      // this.$store.dispatch('setCurrentProgramMidiPedal', parseInt(data))
    })

    this._vm.$socket.client.on(config.controllerSongMessage, (data) => {
      const id = parseInt(data)
      commit(types.SET_CURRENTSONG_ID, id)
      // this.$store.dispatch('setCurrentSongId', parseInt(data))
    })

    this._vm.$socket.client.on(config.controllerGigMessage, (data) => {
      const id = parseInt(data)
      commit(types.SET_SELECTEDGIG_ID, id)
    })

    this._vm.$socket.client.on(config.controllerPedal1Message, (data) => {
      const idx = parseInt(data)
      // console.log(idx)
      commit(types.SET_PEDAL1VALUE, idx)
    })

    this._vm.$socket.client.on(config.controllerPedal2Message, (data) => {
      const idx = parseInt(data)
      // console.log(idx)
      commit(types.SET_PEDAL2VALUE, idx)
    })

    this._vm.$socket.client.on(config.controllerPresetVoluleMessage, (value) => {
      const volume = parseInt(value)
      // console.log(idx)
      commit(types.SET_PRESET_VOLUME_BY_CONTROLLER, volume)
    })

    clientInitialized = true
  }
}

export default actions
