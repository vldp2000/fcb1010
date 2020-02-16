import * as types from './mutation-types'
import GigsService from '@/services/GigsService'
import SongsService from '@/services/SongsService'
import InstrumentsService from '@/services/InstrumentsService'
import InstrumentBankService from '@/services/InstrumentBankService'
import PresetsService from '@/services/PresetsService'
import Vue from 'vue'

const config = require('@/config/config')
let clientInitialized = false
// let clientSubscribed = false

async function setInstrumentIcons (commit) {
  let result = await InstrumentsService.getInstrumentIcons(require.context('../assets/', false, /\.png$/))
  // Vue.$log.debug(result)
  await commit(types.SET_INSTRUMENT_IMAGE, result)
}

async function initAllLists (commit, getters) {
  await commit(types.INIT_INPROGRESS, true)
  Vue.$log.debug('<<<Mutation. Init ALLS>>')
  if (!getters.gigList || getters.gigList.length === 0) {
    let list = await GigsService.getAll()
    // Vue.$log.debug(list.length)
    if (list.length > 0) {
      // Vue.$log.debug('action -  types.SET_GIGLIST')
      await commit(types.SET_GIGLIST, list)
    }
  }
  // Vue.$log.debug(`getters. Lenght of gigList  = ${getters.gigList.length}`)

  if (!getters.songList || getters.songList.length === 0) {
    let list = await SongsService.getAll()
    if (list.length > 0) {
      // Vue.$log.debug('action -  types.SET_SONGLIST')
      await commit(types.SET_SONGLIST, list)
    }
  }
  // Vue.$log.debug(`getters. Lenght of songList  = ${getters.songList.length}`)

  // Vue.$log.debug('populate -  instrumentList')
  if (!getters.instrumentList || getters.instrumentList.length === 0) {
    let list = await InstrumentsService.getAll()
    // Vue.$log.debug(list)
    if (list.length > 0) {
      await commit(types.SET_INSTRUMENTLIST, list)
    }
  }
  // Vue.$log.debug(`getters. Lenght of instrumentList  = ${getters.instrumentList.length}`)

  // Vue.$log.debug('populate -  instrumentBANKList')
  if (!getters.instrumentBankList || getters.instrumentBankList.length === 0) {
    let list = await InstrumentBankService.getAll()
    // Vue.$log.debug(list)
    if (list.length > 0) {
      await commit(types.SET_INSTRUMENTBANKLIST, list)
    } else {
      Vue.$log.debug('>>>  populate -  instrumentBANKList>>> !!!  instrumentBankList is empty')
    }
  }
  // Vue.$log.debug(`getters. Lenght of instrumentBankList  = ${getters.instrumentBankList.length}`)

  if (!getters.presetList || getters.presetList.length === 0) {
    let list = await PresetsService.getAll()
    if (list.length > 0) {
      await commit(types.SET_PRESETLIST, list)
    }
  }
  // Vue.$log.debug(`getters. Lenght of presetList  = ${getters.presetList.length}`)

  if (!getters.gigSongList || getters.gigSongList.length === 0) {
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

  //  Init Is Complete
  commit(types.INIT_ALL)
  commit(types.INIT_INPROGRESS, false)
  Vue.$log.debug('<<<Mutation. Finish Init ALL>>')
}

// ---addNewSong-------
async function addNewSong (getters, song) {
  let newSong = await SongsService.postSong(song)
  // Vue.$log.debug('1. __ New SOng__')
  // Vue.$log.debug(newSong)

  const pList = ['A', 'B', 'C', 'D']
  let pr = {}
  let i = 1
  for (let p of pList) {
    pr = {
      'id': -1,
      'name': p,
      'midipedal': i,
      'refsong': newSong.id,
      'tytle': p
    }
    let newProg = await SongsService.postSongProgram(pr)
    // Vue.$log.debug('2. ---createNewSongProgram-------', newProg)
    // to simplify the creating new song preset there is the default setup enforset
    // each Instrument has the InstrumentBank and Preset records
    // with the same Ids as instrumnent.id
    for (let instrument of getters.instrumentList) {
      let preset = {
        'id': -1,
        'refsong': newSong.id,
        'refsongprogram': newProg.id,
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
      // let newPreset =
      await SongsService.postSongPreset(preset)
      // Vue.$log.debug('3. ---new preset -------', newPreset)
    }
    i = i + 1
  }
  // Vue.$log.debug(' --- new song ---- ', newSong)
  return newSong
}

async function initializeAllLists (commit, getters) {
  // console.log('----------- load All ---- New---')
  await commit(types.INIT_INPROGRESS, true)
  if (!getters.gigList || getters.gigList.length === 0) {
    let gigs = await GigsService.getAllData()
    // console.log(gigs)
    if (gigs.length > 0) {
      // Vue.$log.debug('action -  types.SET_GIGLIST')
      await commit(types.SET_GIGLIST, gigs)
    }
    // console.log('----gig---')
  }

  if (!getters.songList || getters.songList.length === 0) {
    let songs = await SongsService.getAllData()
    // console.log(songs)
    if (songs.length > 0) {
      // Vue.$log.debug('action -  types.SET_SONGLIST')
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
    if (presets.length > 0) {
      await commit(types.SET_PRESETLIST, presets)
    }
    // console.log(presets)
    // console.log('----presets ---')
  }

  for (let gig of getters.gigList) {
    // console.log(gig)
    if (gig.songList || gig.songList > 0) {
      await commit(types.POPULATE_GIG_SONGS, gig.id)
    }
  }

  await setInstrumentIcons(commit)
  //  Init Is Complete
  commit(types.INIT_ALL)
  commit(types.INIT_INPROGRESS, false)
  Vue.$log.debug('<<<Mutation. Finish Init ALL>>')
}

// ----------A C T I O N S--------------------

const actions = {
  newInitAllLists ({ commit, getters }, payload) {
    // console.log('----------- load All ---- start---')
    initializeAllLists(commit, getters)
    console.log('----------- load All ---- end---')
  },

  initAll ({ commit, getters }, payload) {
    initAllLists(commit, getters)
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
    SongsService.putSongProgram(songProgram)
    commit(types.UPDATE_SONGPROGRAM, songProgram)
  },

  updateSongProgramPreset ({ commit }, songPreset) {
    Vue.$log.debug('--- action >> updateSongProgramPreset')
    SongsService.putSongPreset(songPreset)
    Vue.$log.debug('--- action >> SongsService.putSongPreset')
    commit(types.UPDATE_SONGPROGRAMPRESET, songPreset)
    Vue.$log.debug('--- action >> commit(types.UPDATE_SONGPROGRAMPRESET')
  },

  //  Instrument List -----------------------------------------------------
  setInstrumentList ({ commit }, payload) {
    commit(types.SET_INSTRUMENTLIST, payload)
  },
  addInstrument ({ commit }, instrument) {
    commit(types.ADD_INSTRUMENT, instrument)
  },
  updateInstrument ({ commit }, instrument) {
    // Vue.$log.debug('action - updateInstrument')
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
  addPreset ({ commit }, preset) {
    commit(types.ADD_PRESET, preset)
  },
  updatePreset ({ commit }, preset) {
    // Vue.$log.debug('action - updatePreset')
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
    // Vue.$log.debug('action - updateInstrumentBank')
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
    // Vue.$log.debug('action - updateGig')
    commit(types.UPDATE_GIG, gig)
  },

  //  populateGigSongs -----------------------------------------------------
  populateGigSongs ({ commit }, gigId) {
    // Vue.$log.debug('action - populateGigSongs')
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
    // Vue.$log.debug('action - updateGigSong')
    commit(types.UPDATE_GIGSONG, gigsong)
  },

  resetGigSongs ({ commit, getters }, payload) { // {}  gigId, songList)
    try {
      Vue.$log.debug('resetGigSongs')
      // let oldList = Object.assign([], _pickBy(getters.gigSongList, gs => gs.refgig === payload.gigId))
      let oldList = Object.assign([], getters.gigSongList.filter(gs => gs.refgig === payload.gigId))
      Vue.$log.debug(oldList)
      let i = 1
      payload.songList.forEach(song => {
        let gs = oldList.find(item => (item.refsong === song.id))
        Vue.$log.debug(gs)
        if (gs) {
          if (i !== gs.sequencenumber) {
            let gigSong = Object.assign({}, gs)
            gigSong.sequencenumber = i
            Vue.$log.debug(gigSong)
            GigsService.putGigSong(gigSong)
          }
          oldList = oldList.filter(item => item.id !== gs.id)
          Vue.$log.debug(oldList)
        } else {
          let newGS = { 'id': -1, 'refgig': payload.gigId, 'refsong': song.id, 'sequencenumber': i, 'currentFlag': 0 }
          GigsService.postGigSong(newGS)
        }
        // Vue.$log.debug('---------------------------------------')
        i = i + 1
      })
      Vue.$log.debug(oldList)
      oldList.forEach(s => GigsService.deleteGigSong(s.id))
    } catch (ex) {
      Vue.$log.debug(ex)
    }
  },

  //  Set current Song Id-----------------------------------------------------
  setCurrentGigId ({ commit }, id) {
    commit(types.SET_CURRENTGIG_ID, id)
    // Vue.$log.debug('STORE. Set current Gig Id-------------------------------')
    // Vue.$log.debug(id)
  },
  //  setGigAsCurrent -----------------------------------------------------
  setGigAsCurrent ({ commit, getters }, id) {
    getters.gigList.forEach(gig => {
      gig.currentFlag = (gig.id === id)
      GigsService.put(gig)
      commit(types.UPDATE_GIG, gig)
    })
  },

  //  Set current Song Id-----------------------------------------------------
  setCurrentSongId ({ commit }, id) {
    commit(types.SET_CURRENTSONG_ID, id)
    // Vue.$log.debug('STORE. Set current Song Id-------------------------------')
    // Vue.$log.debug(id)
  },
  //  Set current Program Id-----------------------------------------------------
  setCurrentProgramMidiPedal ({ commit }, idx) {
    commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, idx)
  },

  //  Socket Io-----------------------------------------------------
  socketClientInitialize ({ commit }, payload) {
    Vue.$log.debug(';;;;;; socketClientIniotialize ;;;;;;;;')
    Vue.$log.debug(this._vm)
    Vue.$log.debug(this._vm.$socket)

    if (clientInitialized) return

    // Vue.$log.debug(payload)

    this._vm.$socket.client.on('connect', function (data) {
      // Vue.$log.debug('Socket Io-------- Connected')
      // Vue.$log.debug(data)
    })

    this._vm.$socket.client.on(config.controllerProgramMessage, (data) => {
      // Vue.$log.debug('-- Preset socket IO message')
      // Vue.$log.debug(data)
      // this.setCurrentProgramMidiPedal({ commit }, data)
      commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, data)
      // this.$store.dispatch('setCurrentProgramMidiPedal', parseInt(data))
    })
    this._vm.$socket.client.on(config.controllerSongMessage, (data) => {
      // Vue.$log.debug('-- Song socket IO message')
      // Vue.$log.debug(data)
      // this.setCurrentSongId({ commit }, data)
      commit(types.SET_CURRENTSONG_ID, data)
      // this.$store.dispatch('setCurrentSongId', parseInt(data))
    })
    clientInitialized = true
  }
}

export default actions
