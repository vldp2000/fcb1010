import Vue from 'vue'
import * as types from './mutation-types'
import _sortBy from 'lodash/sortBy'
import _pickBy from 'lodash/pickBy'

const mutations = {
  [types.INIT_ALL] (state) {
    state.allInitialized = true
  },
  [types.SET_SONGLIST] (state, songList) {
    state.songList = songList
    // console.log('<State>  songList populated!!!')
    // console.log(songList)
  },
  [types.ADD_SONG] (state, song) {
    state.songList.push(song)
  },
  [types.UPDATE_SONG] (state, song) {
    const item = state.songList.find(item => item.id === song.id)
    Object.assign(item, song)
    // JSON.parse(JSON.stringify(obj)); // <- could be a better option to make a deep copy of an object
    // people recon that Object.assign does the shallow copy
  },
  [types.REFRESH_SONG] (state, payload) {
    state.refreshSong = !state.refreshSong
  },
  [types.ADD_SONG_ITEMS] (state, songPrograms) {
    console.log('Mutation... types.ADD_SONG_ITEMS ....')
    try {
      let song = state.songList.find(sn => sn.id === songPrograms.songId)
      // console.log(` add itens to song list -> ${song.name}`)
      if (song && !song.programList) {
        Vue.set(song, 'programList', songPrograms.programs)
      }
    } catch (ex) {
      console.log('Error. Mutation [types.ADD_SONG_ITEMS] (state, { id, programs })')
      console.log(ex)
    }
  },
  [types.UPDATE_SONGPROGRAMPRESET] (state, payload) {
    try {
      let song = state.songList.find(sn => sn.id === payload.refsong)
      let program = song.programList.find(pr => pr.id === payload.refsongprogram)
      let preset = program.presetList.find(pr => pr.id === payload.refpreset)
      if (preset) {
        console.log('types.UPDATE_SONGPROGRAMPRESET -->>')
        console.log(payload.id)
        console.log(payload)
        preset.refpreset = payload.refpreset
        preset.volume = payload.volume
        preset.pan = payload.pan
        preset.muteflag = payload.muteflag
        preset.reverbflag = payload.reverbflag
        preset.delayflag = payload.delayflag
        preset.modeflag = payload.modeflag
        preset.reverbvalue = payload.reverbvalue
        preset.delayvalue = payload.delayvalue
      }
    } catch (ex) {
      console.log('[types.UPDATE_SONGPROGRAMPRESET] (state, payload)')
      console.log(ex)
    }
  },
  [types.SET_INSTRUMENTLIST] (state, instrumentList) {
    state.instrumentList = instrumentList
  },
  [types.ADD_INSTRUMENT] (state, instrument) {
    state.instrumentList.push(instrument)
  },
  [types.UPDATE_INSTRUMENT] (state, instrument) {
    // console.log('mutations - updateInstrument')
    const item = state.instrumentList.find(item => item.id === instrument.id)
    Object.assign(item, instrument)
  },
  [types.SET_INSTRUMENT_IMAGE] (state, payload) {
    try {
      // console.log('SET_INSTRUMENT_IMAGE ............----->>>')
      // console.log(payload)
      payload.forEach(item => {
        let instrument = state.instrumentList.find(i => i.id === item.id)
        if (!instrument.imageURL) {
          Vue.set(instrument, 'imageURL', item.url)
          // console.log(url)
        }
      })
    } catch (ex) {
      console.log(ex)
    }
  },
  [types.SET_PRESETLIST] (state, presetList) {
    state.presetList = presetList
    // console.log('<State>  presetList populated !!!')
    // console.log(presetList)
  },
  [types.ADD_PRESET] (state, preset) {
    state.presetList.push(preset)
  },
  [types.UPDATE_PRESET] (state, preset) {
    const item = state.presetList.find(item => item.id === preset.id)
    Object.assign(item, preset)
  },

  [types.SET_INSTRUMENTBANKLIST] (state, instrumentBankList) {
    // console.log('mutations - SET InstrumentBank')
    state.instrumentBankList = instrumentBankList
  },
  [types.ADD_INSTRUMENTBANK] (state, instrumentBank) {
    state.instrumentBankList.push(instrumentBank)
  },
  [types.UPDATE_INSTRUMENTBANK] (state, instrumentBank) {
    // console.log('mutations - updateInstrumentBank')
    const item = state.instrumentBankList.find(item => item.id === instrumentBank.id)
    Object.assign(item, instrumentBank)
  },

  [types.SET_GIGLIST] (state, gigList) {
    state.gigList = gigList
    // console.log('<State>  gigList populated ß!!!')
    // console.log(gigList)
    // console.log(state.gigList)
  },

  [types.ADD_GIG] (state, gig) {
    state.gigList.push(gig)
  },

  [types.UPDATE_GIG] (state, gig) {
    const item = state.gigList.find(item => item.id === gig.id)
    Object.assign(item, gig)
  },

  [types.POPULATE_GIG_SONGS] (state, gigId) {
    // console.log('>>>>>>----types.POPULATE_GIG_SONGS -->>')
    // console.log(gigId)
    try {
      let gig = state.gigList.find(item => item.id === gigId)
      if (!gig.songList) {
        let songs = []
        let items = _sortBy((_pickBy(state.gigsongList, s => s.refgig === gigId)), 'sequencenumber')
        // console.log(items)
        items.forEach(item => {
          if (item.refsong) {
            let song = state.songList.find(s => s.id === item.refsong)
            songs.push(song)
          }
        })

        Vue.set(gig, 'songList', songs)
        // console.log(items)
        // console.log(gig)
      }
    } catch (ex) {
      console.log('types.ADD_GIG_SONGS ')
      console.log(ex)
    }
  },

  [types.SET_GIGSONGLIST] (state, gigsongList) {
    state.gigsongList = gigsongList
    // console.log('<State>  gigsongList populated ß!!!')
    // console.log(list)
  },
  [types.ADD_GIGSONG] (state, gigsong) {
    state.gigsongList.push(gigsong)
  },
  [types.UPDATE_GIGSONG] (state, gigsong) {
    const item = state.gigsongList.find(item => item.id === gigsong.id)
    Object.assign(item, gigsong)
  },

  [types.SET_CURRENTGIG_ID] (state, id) {
    state.currentGigId = id
  },
  [types.SET_CURRENTSONG_ID] (state, id) {
    let song = state.songList.find(s => s.id === id)
    if (song) {
      state.currentSongId = id
    } else {
      state.currentSongId = -1
    }
    console.log(`> Mutation SET_CURRENTSONG_ID >> ${id}`)
  },
  [types.SET_CURRENT_PROGRAMMIDIPEDAL] (state, idx) {
    state.currentProgramMidiPedal = idx
  }
}
export default mutations
