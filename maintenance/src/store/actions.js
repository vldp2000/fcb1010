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
  await commit(types.SET_INSTRUMENT_IMAGE, result)
}

async function validateSong (song) {
  const pList = ['A', 'B', 'C', 'D']
  let i = 0

  if (song.programList || song.programList.length !== 4) {
    return false
  }

  for (let p of pList) {
    const program = song.programList[i]
    if (program.name !== p || program.refsong !== song.id || program.midipedal !== i + 1 || !program.presetList || program.presetList.length !== 4) {
      return false
    }
    let instList = []
    let instBankList = []
    let presetList = []
    for (let preset of program.presetList) {
      if (preset.refsong !== song.id || preset.refsongprogram !== program.id) {
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
    }
    song.programList.push(pr)
    i = i + 1
  }
  const newSong = await SongsService.putSong(song)
  return newSong
}

async function updateGigSongCollection (getters, gig) {
  if (gig && gig.shortSongList && gig.shortSongList.length > 0) {
    let songs = []
    for (let item of gig.shortSongList) {
      let song = await getters.songList.find(s => s.id === item.id)
      if (song) {
        await songs.push(song)
      }
    }
    return songs
  } else {
    return []
  }
}
async function initializeAllLists (commit, getters) {
  await commit(types.INIT_INPROGRESS, true)

  if (!getters.songList || getters.songList.length === 0) {
    let songs = await SongsService.getAllData()
    if (songs.length > 0) {
      for (let song of songs) {
        if (!validateSong(song)) {
          Vue.$log.error(`Error. Song Invalid ${song.id}`)
        }
      }
      await commit(types.SET_SONGLIST, songs)
    }
  }

  if (!getters.instrumentList || getters.instrumentList.length === 0) {
    let instruments = await InstrumentsService.getAllData()
    if (instruments.length > 0) {
      await commit(types.SET_INSTRUMENTLIST, instruments)
    }
  }

  if (!getters.instrumentBankList || getters.instrumentBankList.length === 0) {
    let instrumentBanks = await InstrumentBankService.getAllData()
    if (instrumentBanks.length > 0) {
      await commit(types.SET_INSTRUMENTBANKLIST, instrumentBanks)
    }
  }

  if (!getters.presetList || getters.presetList.length === 0) {
    let presets = await PresetsService.getAllData()
    if (presets.length > 0) {
      let sortedList = await _sortBy(presets, 'name')
      await commit(types.SET_PRESETLIST, sortedList)
    }
  }

  if (!getters.gigList || getters.gigList.length === 0) {
    let gigs = await GigsService.getAllData()
    if (gigs.length > 0) {
      for (let gig of gigs) {
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
      await commit(types.SET_GIGLIST, gigs)
    }
  }

  for (let gig of getters.gigList) {
    if (gig.shortSongList && gig.shortSongList.length > 0) {
      const songs = await updateGigSongCollection(getters, gig)
      const payload = { 'gigId': gig.id, 'songs': songs }
      await commit(types.POPULATE_GIG_SONGS, payload)
    }
  }

  const gigId = await GigsService.getScheduledGigId()
  await commit(types.SET_SCHEDULEDGIG_ID, gigId)
  await setInstrumentIcons(commit)
  commit(types.INIT_INPROGRESS, false)
}

// ----------A C T I O N S--------------------

const actions = {
  initAllLists ({ commit, getters }, payload) {
    initializeAllLists(commit, getters)
  },
  //  Song List -----------------------------------------------------
  setSongList ({ commit }, payload) {
    commit(types.SET_SONGLIST, payload)
  },

  addSong ({ commit, getters }, song) {
    const newSong = addNewSong(getters, song)
    commit(types.ADD_SONG, newSong)
  },

  updateSong ({ commit }, song) {
    SongsService.putSong(song)
    commit(types.UPDATE_SONG, song)
  },
  refreshSong ({ commit }, songId) {
    commit(types.REFRESH_SONG, songId)
  },
  async addSongItems ({ commit }, songId) {
    try {
      let songPrograms = await SongsService.getSongItems(songId)
      await commit(types.ADD_SONG_ITEMS, songPrograms)
      await commit(types.REFRESH_SONG, songId)
    } catch (ex) {
      Vue.$log.error(ex)
    }
  },
  updateSongProgram ({ commit }, songProgram) {
    commit(types.UPDATE_SONGPROGRAM, songProgram)
  },

  updateSongProgramPreset ({ commit }, songPreset) {
    commit(types.UPDATE_SONGPROGRAMPRESET, songPreset)
  },

  //  Instrument List -----------------------------------------------------
  setInstrumentList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTLIST, payload)
  },
  async addInstrument ({ commit }, instrument) {
    const id = await InstrumentsService.getId()
    instrument.id = id
    await InstrumentsService.put(instrument)
    commit(types.ADD_INSTRUMENT, instrument)
  },
  updateInstrument ({ commit }, instrument) {
    InstrumentsService.put(this.instrument)
    commit(types.UPDATE_INSTRUMENT, instrument)
  },

  setInstrumentImage ({ commit }, payload) {
    commit(types.SET_INSTRUMENT_IMAGE, payload)
  },

  //  Preset List -----------------------------------------------------
  setPresetList ({ commit }, payload) {
    commit(types.SET_PRESETLIST, payload)
  },
  async addPreset ({ commit }, preset) {
    const id = await PresetsService.getId()
    preset.id = id
    await PresetsService.put(preset)
    await commit(types.ADD_PRESET, preset)
  },
  updatePreset ({ commit }, preset) {
    PresetsService.put(preset)
    commit(types.UPDATE_PRESET, preset)
  },

  //  Instrument Bank List -----------------------------------------------------
  setInstrumentBankList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTBANKLIST, payload)
  },
  async addInstrumentBank ({ commit }, instrumentBank) {
    const id = await InstrumentBankService.getId()
    instrumentBank.id = id
    await InstrumentBankService.put(instrumentBank)
    commit(types.ADD_INSTRUMENTBANK, instrumentBank)
  },
  updateInstrumentBank ({ commit }, instrumentBank) {
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
    await GigsService.putGig(gig)

    commit(types.ADD_GIG, gig)
  },
  updateGig ({ commit }, gig) {
    GigsService.putGig(gig)
    commit(types.UPDATE_GIG, gig)
  },

  //  populateGigSongs -----------------------------------------------------
  populateGigSongs ({ commit }, payload) {
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
    commit(types.UPDATE_GIGSONG, gigsong)
  },

  resetGigSongs ({ commit, getters }, payload) { // {}  gigId, songList)
    try {
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
      commit(types.UPDATE_GIG, gig)
    } catch (ex) {
      Vue.$log.error(ex)
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
  //  Socket Io.  VIEW_EDIT_MODE_MESSAGE---------------------------------------
  sendEditMode ({ commit }, editFlag) {
    this._vm.$socket.client.emit(config.viewEditModeMessage, editFlag)
  },
  sendChangePresetVolumeMessage ({ commit }, payload) {
    this._vm.$socket.client.emit(config.viewPresetVolMessage, payload)
  },
  //  Socket Client Initialize
  socketClientInitialize ({ commit }, payload) {
    if (clientInitialized) return
    this._vm.$socket.client.on('connect', function (data) {
    })

    this._vm.$socket.client.on(config.controllerProgramMessage, (data) => {
      const idx = parseInt(data)
      commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, idx)
    })

    this._vm.$socket.client.on(config.controllerSongMessage, (data) => {
      const id = parseInt(data)
      commit(types.SET_CURRENTSONG_ID, id)
    })

    this._vm.$socket.client.on(config.controllerGigMessage, (data) => {
      const id = parseInt(data)
      commit(types.SET_SELECTEDGIG_ID, id)
    })

    this._vm.$socket.client.on(config.controllerPedal1Message, (data) => {
      const idx = parseInt(data)
      commit(types.SET_PEDAL1VALUE, idx)
    })

    this._vm.$socket.client.on(config.controllerPedal2Message, (data) => {
      const idx = parseInt(data)
      commit(types.SET_PEDAL2VALUE, idx)
    })

    this._vm.$socket.client.on(config.controllerPresetVoluleMessage, (value) => {
      const volume = parseInt(value)
      commit(types.SET_PRESET_VOLUME_BY_CONTROLLER, volume)
    })

    clientInitialized = true
  }
}

export default actions
