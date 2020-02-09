import * as types from './mutation-types'
import GigsService from '@/services/GigsService'
import SongsService from '@/services/SongsService'
import InstrumentsService from '@/services/InstrumentsService'
import InstrumentBankService from '@/services/InstrumentBankService'
import PresetsService from '@/services/PresetsService'
// import _sortBy from 'lodash/sortBy'
// import _pickBy from 'lodash/pickBy'

const config = require('@/config/config')
let clientInitialized = false
// let clientSubscribed = false

async function setInstrumentIcons (commit) {
  let result = await InstrumentsService.getInstrumentIcons(require.context('../assets/', false, /\.png$/))
  // console.log(result)
  await commit(types.SET_INSTRUMENT_IMAGE, result)
}

async function initAllLists (commit, getters) {
  await commit(types.INIT_INPROGRESS, true)
  console.log('<<<Mutation. Init ALLS>>')
  if (!getters.gigList || getters.gigList.length === 0) {
    let list = await GigsService.getAll()
    // console.log(list.length)
    if (list.length > 0) {
      // console.log('action -  types.SET_GIGLIST')
      await commit(types.SET_GIGLIST, list)
    }
  }
  // console.log(`getters. Lenght of gigList  = ${getters.gigList.length}`)

  if (!getters.songList || getters.songList.length === 0) {
    let list = await SongsService.getAll()
    if (list.length > 0) {
      // console.log('action -  types.SET_SONGLIST')
      await commit(types.SET_SONGLIST, list)
    }
  }
  // console.log(`getters. Lenght of songList  = ${getters.songList.length}`)

  // console.log('populate -  instrumentList')
  if (!getters.instrumentList || getters.instrumentList.length === 0) {
    let list = await InstrumentsService.getAll()
    // console.log(list)
    if (list.length > 0) {
      await commit(types.SET_INSTRUMENTLIST, list)
    }
  }
  // console.log(`getters. Lenght of instrumentList  = ${getters.instrumentList.length}`)

  // console.log('populate -  instrumentBANKList')
  if (!getters.instrumentBankList || getters.instrumentBankList.length === 0) {
    let list = await InstrumentBankService.getAll()
    // console.log(list)
    if (list.length > 0) {
      await commit(types.SET_INSTRUMENTBANKLIST, list)
    } else {
      console.log('>>>  populate -  instrumentBANKList>>> !!!  instrumentBankList is empty')
    }
  }
  // console.log(`getters. Lenght of instrumentBankList  = ${getters.instrumentBankList.length}`)

  if (!getters.presetList || getters.presetList.length === 0) {
    let list = await PresetsService.getAll()
    if (list.length > 0) {
      await commit(types.SET_PRESETLIST, list)
    }
  }
  // console.log(`getters. Lenght of presetList  = ${getters.presetList.length}`)

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
  console.log('<<<Mutation. Finish Init ALL>>')
}

// ------------------------------

const actions = {
  initAll ({ commit, getters }, payload) {
    initAllLists(commit, getters)
  },
  //  Song List -----------------------------------------------------
  setSongList ({ commit }, payload) {
    commit(types.SET_SONGLIST, payload)
  },
  addSong ({ commit, getters }, song) {
    const pList = ['A', 'B', 'C', 'D']
    let i = 1
    pList.forEach(p => {
      const prog = SongsService.postSongProgram(
        {
          'id': -1,
          'name': p,
          'midipedal': i,
          'refsong': song.id,
          'tytle': p
        }
      )
      // to simplify the creating new song preset there is the default setup enforset
      // each Instrument has the InstrumentBank and Preset records
      // with the same Ids as instrumnent.id
      getters.instrumentList.forEach(instrument => {
        SongsService.postSongPreset({
          'id': -1,
          'refsong': song.id,
          'refsongprogram': prog.id,
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
        })
      })
      i = i + 1
    })
    const newSong = SongsService.postSong(song)
    commit(types.ADD_SONG, newSong)
  },
  updateSong ({ commit }, song) {
    // console.log('action - updateSong')
    SongsService.putSong(song)
    commit(types.UPDATE_SONG, song)
  },
  refreshSong ({ commit }, songId) {
    // console.log('action - updateSong')
    commit(types.REFRESH_SONG, songId)
  },
  async addSongItems ({ commit }, songId) {
    try {
      // console.log('<<<<   action - addSongItems >>>>>>')
      let songPrograms = await SongsService.getSongItems(songId)
      // console.log(songPrograms)
      await commit(types.ADD_SONG_ITEMS, songPrograms)
      await commit(types.REFRESH_SONG, songId)
    } catch (ex) {
      console.log(ex)
    }
  },

  updateSongProgramPreset ({ commit }, songPreset) {
    console.log('--- action >> updateSongProgramPreset')
    SongsService.putSongPreset(songPreset)
    console.log('--- action >> SongsService.putSongPreset')
    commit(types.UPDATE_SONGPROGRAMPRESET, songPreset)
    console.log('--- action >> commit(types.UPDATE_SONGPROGRAMPRESET')
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

  resetGigSongs ({ commit, getters }, payload) { // {}  gigId, songList)
    try {
      console.log('resetGigSongs')
      // let oldList = Object.assign([], _pickBy(getters.gigSongList, gs => gs.refgig === payload.gigId))
      let oldList = Object.assign([], getters.gigSongList.filter(gs => gs.refgig === payload.gigId))
      console.log(oldList)
      let i = 1
      payload.songList.forEach(song => {
        let gs = oldList.find(item => (item.refsong === song.id))
        console.log(gs)
        if (gs) {
          if (i !== gs.sequencenumber) {
            let gigSong = Object.assign({}, gs)
            gigSong.sequencenumber = i
            console.log(gigSong)
            GigsService.putGigSong(gigSong)
          }
          oldList = oldList.filter(item => item.id !== gs.id)
          console.log(oldList)
        } else {
          let newGS = { 'id': -1, 'refgig': payload.gigId, 'refsong': song.id, 'sequencenumber': i, 'currentFlag': 0 }
          GigsService.postGigSong(newGS)
        }
        // console.log('---------------------------------------')
        i = i + 1
      })
      console.log(oldList)
      oldList.forEach(s => GigsService.deleteGigSong(s.id))
    } catch (ex) {
      console.log(ex)
    }
  },

  //  Set current Song Id-----------------------------------------------------
  setCurrentGigId ({ commit }, id) {
    commit(types.SET_CURRENTGIG_ID, id)
    // console.log('STORE. Set current Gig Id-------------------------------')
    // console.log(id)
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
    // console.log('STORE. Set current Song Id-------------------------------')
    // console.log(id)
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

    // console.log(payload)

    this._vm.$socket.client.on('connect', function (data) {
      // console.log('Socket Io-------- Connected')
      // console.log(data)
    })

    this._vm.$socket.client.on(config.controllerProgramMessage, (data) => {
      // console.log('-- Preset socket IO message')
      // console.log(data)
      // this.setCurrentProgramMidiPedal({ commit }, data)
      commit(types.SET_CURRENT_PROGRAMMIDIPEDAL, data)
      // this.$store.dispatch('setCurrentProgramMidiPedal', parseInt(data))
    })
    this._vm.$socket.client.on(config.controllerSongMessage, (data) => {
      // console.log('-- Song socket IO message')
      // console.log(data)
      // this.setCurrentSongId({ commit }, data)
      commit(types.SET_CURRENTSONG_ID, data)
      // this.$store.dispatch('setCurrentSongId', parseInt(data))
    })
    clientInitialized = true
  }
}

export default actions
