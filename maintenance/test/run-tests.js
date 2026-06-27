const assert = require('assert')
const fs = require('fs')
const path = require('path')
const Module = require('module')
const babel = require('@babel/core')

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.join(rootDir, 'src')

function makeVueMock () {
  return {
    set (target, key, value) {
      target[key] = value
    },
    $log: {
      debug () {},
      error () {}
    }
  }
}

function loadSourceModule (relativeFile, mocks = {}, cache = {}) {
  let fileName = path.resolve(srcDir, relativeFile)
  if (!fs.existsSync(fileName) && fs.existsSync(`${fileName}.js`)) {
    fileName = `${fileName}.js`
  }
  if (cache[fileName]) return cache[fileName].exports

  const source = fs.readFileSync(fileName, 'utf8')
  let transformed = babel.transformSync(source, {
    filename: fileName,
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current'
        }
      }]
    ],
    babelrc: false,
    configFile: false
  }).code
  transformed = `const __requireContext = function () {
    const context = function () { return '' }
    context.keys = function () { return [] }
    return context
  }
${transformed.replace(/require\.context/g, '__requireContext')}`

  const mod = new Module(fileName, module)
  cache[fileName] = mod
  mod.filename = fileName
  mod.paths = Module._nodeModulePaths(path.dirname(fileName))

  const originalRequire = mod.require.bind(mod)
  mod.require = function (request) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }

    if (request.startsWith('@/')) {
      const target = path.join(srcDir, request.slice(2))
      return loadSourceModule(path.relative(srcDir, target), mocks, cache)
    }

    if (request.startsWith('./') || request.startsWith('../')) {
      const target = path.resolve(path.dirname(fileName), request)
      if (fs.existsSync(`${target}.js`) || fs.existsSync(target)) {
        return loadSourceModule(path.relative(srcDir, target), mocks, cache)
      }
    }

    return originalRequire(request)
  }

  mod._compile(transformed, fileName)
  return mod.exports
}

function loadVueComponent (relativeFile, mocks = {}, cache = {}) {
  const fileName = path.resolve(srcDir, relativeFile)
  if (cache[fileName]) return cache[fileName].exports.default || cache[fileName].exports

  const source = fs.readFileSync(fileName, 'utf8')
  const scriptMatch = source.match(/<script>([\s\S]*?)<\/script>/)
  if (!scriptMatch) {
    throw new Error(`${relativeFile} does not contain a script block`)
  }

  const transformed = babel.transformSync(scriptMatch[1], {
    filename: fileName,
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current'
        }
      }]
    ],
    babelrc: false,
    configFile: false
  }).code

  const mod = new Module(fileName, module)
  cache[fileName] = mod
  mod.filename = fileName
  mod.paths = Module._nodeModulePaths(path.dirname(fileName))

  const originalRequire = mod.require.bind(mod)
  mod.require = function (request) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request]
    }

    if (request === 'vuex') {
      return {
        mapState (keys) {
          return keys.reduce((result, key) => {
            result[key] = function () {
              return this[key]
            }
            return result
          }, {})
        }
      }
    }

    if (request.startsWith('@/')) {
      const target = path.join(srcDir, request.slice(2))
      if (fs.existsSync(`${target}.vue`)) {
        return loadVueComponent(`${path.relative(srcDir, target)}.vue`, mocks, cache)
      }
      return loadSourceModule(path.relative(srcDir, target), mocks, cache)
    }

    if (request.startsWith('./') || request.startsWith('../')) {
      const target = path.resolve(path.dirname(fileName), request)
      if (fs.existsSync(`${target}.vue`)) {
        return loadVueComponent(`${path.relative(srcDir, target)}.vue`, mocks, cache)
      }
      if (fs.existsSync(`${target}.js`) || fs.existsSync(target)) {
        return loadSourceModule(path.relative(srcDir, target), mocks, cache)
      }
    }

    return originalRequire(request)
  }

  mod._compile(transformed, fileName)
  return mod.exports.default || mod.exports
}

function makeComponentContext (component, overrides = {}) {
  const dispatches = []
  const emitted = []
  const context = {
    $store: {
      dispatch (type, payload) {
        dispatches.push({ type, payload })
        return Promise.resolve()
      }
    },
    $log: makeVueMock().$log,
    $emit (eventName, payload) {
      emitted.push({ eventName, payload })
    },
    dispatches,
    emitted
  }

  if (component.data) {
    Object.assign(context, component.data.call(context))
  }

  if (component.methods) {
    for (let [name, method] of Object.entries(component.methods)) {
      context[name] = method.bind(context)
    }
  }

  Object.assign(context, overrides)
  return context
}

function makeValidSong () {
  return {
    id: 10,
    name: 'Valid Song',
    programList: ['A', 'B', 'C', 'D'].map((name, programIndex) => ({
      id: programIndex + 1,
      name,
      tytle: name,
      refsong: 10,
      midipedal: programIndex + 1,
      presetList: [1, 2, 3, 4].map((instrumentId, presetIndex) => ({
        id: (programIndex * 4) + presetIndex + 1,
        refsong: 10,
        refsongprogram: programIndex + 1,
        refinstrument: instrumentId,
        refinstrumentbank: instrumentId,
        refpreset: instrumentId,
        volume: 64
      }))
    }))
  }
}

function makeActionsModule (serviceOverrides = {}) {
  const serviceCalls = {
    instrumentsPut: [],
    songsGetById: [],
    songsPut: [],
    presetsPut: [],
    instrumentBanksPut: [],
    gigsPut: [],
    scheduledGigIds: [],
    emitted: [],
    socketHandlers: {}
  }

  const services = {
    '@/services/SongsService': {
      async getAllData () {
        return [makeValidSong()]
      },
      async getId () {
        return 11
      },
      async putSong (song) {
        serviceCalls.songsPut.push(song)
      },
      async getSongItems (songId) {
        serviceCalls.songsGetById.push(songId)
        return {
          songId,
          programs: makeValidSong().programList
        }
      },
      ...serviceOverrides.SongsService
    },
    '@/services/InstrumentsService': {
      async getAllData () {
        return [{ id: 1, name: 'BiasFX', imageURL: '' }]
      },
      async getId () {
        return 1
      },
      async put (instrument) {
        serviceCalls.instrumentsPut.push(instrument)
      },
      async getInstrumentIcons () {
        return []
      },
      ...serviceOverrides.InstrumentsService
    },
    '@/services/InstrumentBankService': {
      async getAllData () {
        return [{ id: 1, name: 'Bank', refinstrument: 1 }]
      },
      async getId () {
        return 1
      },
      async put (instrumentBank) {
        serviceCalls.instrumentBanksPut.push(instrumentBank)
      },
      ...serviceOverrides.InstrumentBankService
    },
    '@/services/PresetsService': {
      async getAllData () {
        return [{ id: 1, name: 'Preset', refinstrument: 1, midipc: 1 }]
      },
      async getId () {
        return 1
      },
      async put (preset) {
        serviceCalls.presetsPut.push(preset)
      },
      ...serviceOverrides.PresetsService
    },
    '@/services/GigsService': {
      async getAllData () {
        return [{
          id: 1,
          name: 'Gig',
          shortSongList: [{ id: 10, sequencenumber: 1 }]
        }]
      },
      async getScheduledGigId () {
        return 1
      },
      async getId () {
        return 1
      },
      async putGig (gig) {
        serviceCalls.gigsPut.push(gig)
      },
      async saveScheduledGigId (id) {
        serviceCalls.scheduledGigIds.push(id)
      },
      ...serviceOverrides.GigsService
    },
    vue: makeVueMock()
  }

  const moduleExports = loadSourceModule('store/actions.js', services, {})
  return {
    actions: moduleExports.default,
    helpers: moduleExports,
    serviceCalls
  }
}

function makeDeferred () {
  let resolve
  let reject
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return {
    promise,
    resolve,
    reject
  }
}

async function flushPromises () {
  await Promise.resolve()
  await Promise.resolve()
}

function readSrcFile (relativeFile) {
  return fs.readFileSync(path.join(srcDir, relativeFile), 'utf8')
}

function makeGettersModule () {
  return loadSourceModule('store/getters.js', {}, {})
}

function makeMutationsModule () {
  return loadSourceModule('store/mutations.js', {
    vue: makeVueMock()
  }, {})
}

function makeSongsServiceModule (responseData) {
  const calls = []
  const Api = function () {
    return {
      async get (url) {
        calls.push({ method: 'GET', url })
        return {
          data: responseData
        }
      }
    }
  }

  return {
    SongsService: loadSourceModule('services/SongsService.js', {
      '@/services/Api': Api,
      vue: makeVueMock()
    }, {}).default,
    calls
  }
}

function makeServiceModule (relativeFile, responseData) {
  const calls = []
  const Api = function () {
    return {
      async get (url) {
        calls.push({ method: 'GET', url })
        return {
          data: responseData
        }
      },
      async put (url, body) {
        calls.push({ method: 'PUT', url, body })
        return {
          data: body
        }
      }
    }
  }

  return {
    service: loadSourceModule(relativeFile, {
      '@/services/Api': Api,
      vue: makeVueMock()
    }, {}).default,
    calls
  }
}

function makeCommitRecorder () {
  const commits = []
  return {
    commits,
    commit (type, payload) {
      commits.push({ type, payload })
    }
  }
}

function makeSocketActionContext () {
  const { actions, serviceCalls } = makeActionsModule()
  const { commits, commit } = makeCommitRecorder()
  const socketClient = {
    emit (eventName, payload) {
      serviceCalls.emitted.push({ eventName, payload })
    },
    on (eventName, handler) {
      serviceCalls.socketHandlers[eventName] = handler
    }
  }

  return {
    actions,
    serviceCalls,
    commits,
    context: {
      commit,
      _vm: {
        $socket: {
          client: socketClient
        }
      }
    }
  }
}

async function testValidateSongAcceptsValidSong () {
  const { helpers } = makeActionsModule()

  assert.strictEqual(await helpers.validateSong(makeValidSong()), true)
}

async function testValidateSongRejectsMissingProgramList () {
  const { helpers } = makeActionsModule()

  assert.strictEqual(await helpers.validateSong({ id: 10, name: 'No Programs' }), false)
}

async function testInitializeAllListsMarksInitializationComplete () {
  const { helpers } = makeActionsModule()
  const commits = []
  const getters = {
    songList: [],
    instrumentList: [],
    instrumentBankList: [],
    presetList: [],
    gigList: []
  }

  await helpers.initializeAllLists((type, payload) => {
    commits.push({ type, payload })
    if (type === 'SET_SONGLIST') getters.songList = payload
    if (type === 'SET_INSTRUMENTLIST') getters.instrumentList = payload
    if (type === 'SET_INSTRUMENTBANKLIST') getters.instrumentBankList = payload
    if (type === 'SET_PRESETLIST') getters.presetList = payload
    if (type === 'SET_GIGLIST') getters.gigList = payload
  }, getters)

  assert(commits.find(commit => commit.type === 'INIT_ALL'))
  assert.deepStrictEqual(commits.at(-1), { type: 'INIT_INPROGRESS', payload: false })
}

async function testUpdateInstrumentPersistsPayload () {
  const { actions, serviceCalls } = makeActionsModule()
  const commits = []
  const instrument = {
    id: 2,
    name: 'SampleTank',
    midichannel: 1
  }

  await actions.updateInstrument({ commit: (type, payload) => commits.push({ type, payload }) }, instrument)

  assert.deepStrictEqual(serviceCalls.instrumentsPut, [instrument])
  assert.deepStrictEqual(commits, [{ type: 'UPDATE_INSTRUMENT', payload: instrument }])
}

async function testAddNewSongBuildsDefaultProgramsAndPresets () {
  const { helpers, serviceCalls } = makeActionsModule()
  const song = {
    name: 'New Song'
  }

  await helpers.addNewSong({
    instrumentList: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
  }, song)

  assert.strictEqual(song.id, 11)
  assert.deepStrictEqual(song.programList.map(program => program.name), ['A', 'B', 'C', 'D'])
  assert.strictEqual(song.programList[0].presetList.length, 4)
  assert.deepStrictEqual(song.programList[0].presetList[0], {
    id: 1,
    refsong: 11,
    refsongprogram: 1,
    refinstrument: 1,
    refinstrumentbank: 1,
    refpreset: 1,
    volume: 0,
    pan: 64,
    muteflag: 0,
    boostflag: 0,
    reverbflag: 0,
    delayflag: 0,
    modeflag: 0,
    reverbvalue: 0,
    delayvalue: 0
  })
  assert.deepStrictEqual(serviceCalls.songsPut, [song])
}

async function testUpdateGigSongCollectionMapsShortSongList () {
  const { helpers } = makeActionsModule()
  const songA = {
    id: 1,
    name: 'A'
  }
  const songB = {
    id: 2,
    name: 'B'
  }

  assert.deepStrictEqual(await helpers.updateGigSongCollection({
    songList: [songA, songB]
  }, {
    shortSongList: [{ id: 2 }, { id: 99 }, { id: 1 }]
  }), [songB, songA])
  assert.deepStrictEqual(await helpers.updateGigSongCollection({ songList: [] }, null), [])
}

async function testSimpleListActionsCommitPayloads () {
  const { actions } = makeActionsModule()
  const { commits, commit } = makeCommitRecorder()
  const context = { commit }
  const cases = [
    ['setSongList', 'SET_SONGLIST', [{ id: 1 }]],
    ['refreshSong', 'REFRESH_SONG', 1],
    ['updateSongProgram', 'UPDATE_SONGPROGRAM', { id: 1 }],
    ['updateSongProgramPreset', 'UPDATE_SONGPROGRAMPRESET', { id: 1 }],
    ['setInstrumentList', 'SET_INSTRUMENTLIST', [{ id: 1 }]],
    ['setInstrumentImage', 'SET_INSTRUMENT_IMAGE', [{ id: 1 }]],
    ['setPresetList', 'SET_PRESETLIST', [{ id: 1 }]],
    ['setInstrumentBankList', 'SET_INSTRUMENTBANKLIST', [{ id: 1 }]],
    ['setGigList', 'SET_GIGLIST', [{ id: 1 }]],
    ['populateGigSongs', 'POPULATE_GIG_SONGS', { gigId: 1, songs: [] }],
    ['setGigSongList', 'SET_GIGSONGLIST', [{ id: 1 }]],
    ['addGigSong', 'ADD_GIGSONG', { id: 1 }],
    ['updateGigSong', 'UPDATE_GIGSONG', { id: 1 }],
    ['setSelectedGigId', 'SET_SELECTEDGIG_ID', 1],
    ['setCurrentSongId', 'SET_CURRENTSONG_ID', 2],
    ['setCurrentProgramMidiPedal', 'SET_CURRENT_PROGRAMMIDIPEDAL', 3]
  ]

  for (let [actionName, type, payload] of cases) {
    actions[actionName](context, payload)
    assert.deepStrictEqual(commits.pop(), { type, payload })
  }
}

async function testAddEntityActionsAssignIdsPersistAndCommit () {
  const { actions, serviceCalls } = makeActionsModule({
    InstrumentsService: {
      async getId () {
        return 21
      }
    },
    PresetsService: {
      async getId () {
        return 22
      }
    },
    InstrumentBankService: {
      async getId () {
        return 23
      }
    },
    GigsService: {
      async getId () {
        return 24
      }
    }
  })
  const { commits, commit } = makeCommitRecorder()

  const instrument = { name: 'Instrument' }
  await actions.addInstrument({ commit }, instrument)
  assert.strictEqual(instrument.id, 21)
  assert.deepStrictEqual(serviceCalls.instrumentsPut.at(-1), instrument)
  assert.deepStrictEqual(commits.pop(), { type: 'ADD_INSTRUMENT', payload: instrument })

  const preset = { name: 'Preset' }
  await actions.addPreset({ commit }, preset)
  assert.strictEqual(preset.id, 22)
  assert.deepStrictEqual(serviceCalls.presetsPut.at(-1), preset)
  assert.deepStrictEqual(commits.pop(), { type: 'ADD_PRESET', payload: preset })

  const instrumentBank = { name: 'Bank' }
  await actions.addInstrumentBank({ commit }, instrumentBank)
  assert.strictEqual(instrumentBank.id, 23)
  assert.deepStrictEqual(serviceCalls.instrumentBanksPut.at(-1), instrumentBank)
  assert.deepStrictEqual(commits.pop(), { type: 'ADD_INSTRUMENTBANK', payload: instrumentBank })

  const gig = { name: 'Gig' }
  await actions.addGig({ commit }, gig)
  assert.strictEqual(gig.id, 24)
  assert.deepStrictEqual(serviceCalls.gigsPut.at(-1), gig)
  assert.deepStrictEqual(commits.pop(), { type: 'ADD_GIG', payload: gig })
}

async function testUpdateSongPersistsBeforeCommit () {
  const { actions, serviceCalls } = makeActionsModule()
  const { commits, commit } = makeCommitRecorder()
  const song = { id: 1, name: 'Song' }

  await actions.updateSong({ commit }, song)

  assert.deepStrictEqual(serviceCalls.songsPut, [song])
  assert.deepStrictEqual(commits, [{ type: 'UPDATE_SONG', payload: song }])
}

async function testUpdatePresetWaitsForApiBeforeCommit () {
  const deferred = makeDeferred()
  const preset = {
    id: 3,
    name: 'Lead',
    midipc: 30
  }
  const { actions } = makeActionsModule({
    PresetsService: {
      async put () {
        await deferred.promise
      }
    }
  })
  const commits = []

  const actionPromise = actions.updatePreset({ commit: (type, payload) => commits.push({ type, payload }) }, preset)
  await flushPromises()
  assert.deepStrictEqual(commits, [])

  deferred.resolve()
  await actionPromise
  assert.deepStrictEqual(commits, [{ type: 'UPDATE_PRESET', payload: preset }])
}

async function testUpdateInstrumentBankWaitsForApiBeforeCommit () {
  const deferred = makeDeferred()
  const instrumentBank = {
    id: 4,
    name: 'Bank',
    refinstrument: 1
  }
  const { actions } = makeActionsModule({
    InstrumentBankService: {
      async put () {
        await deferred.promise
      }
    }
  })
  const commits = []

  const actionPromise = actions.updateInstrumentBank({ commit: (type, payload) => commits.push({ type, payload }) }, instrumentBank)
  await flushPromises()
  assert.deepStrictEqual(commits, [])

  deferred.resolve()
  await actionPromise
  assert.deepStrictEqual(commits, [{ type: 'UPDATE_INSTRUMENTBANK', payload: instrumentBank }])
}

async function testUpdateGigWaitsForApiBeforeCommit () {
  const deferred = makeDeferred()
  const gig = {
    id: 1,
    name: 'Sydney2024'
  }
  const { actions } = makeActionsModule({
    GigsService: {
      async putGig () {
        await deferred.promise
      }
    }
  })
  const commits = []

  const actionPromise = actions.updateGig({ commit: (type, payload) => commits.push({ type, payload }) }, gig)
  await flushPromises()
  assert.deepStrictEqual(commits, [])

  deferred.resolve()
  await actionPromise
  assert.deepStrictEqual(commits, [{ type: 'UPDATE_GIG', payload: gig }])
}

async function testResetGigSongsWaitsForApiBeforeCommit () {
  const deferred = makeDeferred()
  const gig = {
    id: 1,
    name: 'Sydney2024',
    shortSongList: [],
    songList: []
  }
  const song = {
    id: 10,
    name: 'Song'
  }
  const { actions } = makeActionsModule({
    GigsService: {
      async putGig () {
        await deferred.promise
      }
    }
  })
  const commits = []

  const actionPromise = actions.resetGigSongs({
    commit: (type, payload) => commits.push({ type, payload }),
    getters: {
      songList: [song]
    }
  }, {
    gig,
    songList: [song]
  })
  await flushPromises()
  assert.deepStrictEqual(commits, [])

  deferred.resolve()
  await actionPromise
  assert.strictEqual(commits.length, 1)
  assert.strictEqual(commits[0].type, 'UPDATE_GIG')
  assert.deepStrictEqual(commits[0].payload.shortSongList, [{ id: 10, sequencenumber: 1 }])
}

async function testSetGigAsScheduledWaitsForApiBeforeCommit () {
  const deferred = makeDeferred()
  const { actions } = makeActionsModule({
    GigsService: {
      async saveScheduledGigId () {
        await deferred.promise
      }
    }
  })
  const commits = []

  const actionPromise = actions.setGigAsScheduled({ commit: (type, payload) => commits.push({ type, payload }) }, 7)
  await flushPromises()
  assert.deepStrictEqual(commits, [])

  deferred.resolve()
  await actionPromise
  assert.deepStrictEqual(commits, [{ type: 'SET_SCHEDULEDGIG_ID', payload: 7 }])
}

async function testAddSongItemsLoadsSongPrograms () {
  const { actions, serviceCalls } = makeActionsModule()
  const commits = []

  await actions.addSongItems({ commit: (type, payload) => commits.push({ type, payload }) }, 10)

  assert.deepStrictEqual(serviceCalls.songsGetById, [10])
  assert.strictEqual(commits[0].type, 'ADD_SONG_ITEMS')
  assert.strictEqual(commits[0].payload.songId, 10)
  assert.strictEqual(commits[0].payload.programs.length, 4)
  assert.deepStrictEqual(commits[1], { type: 'REFRESH_SONG', payload: 10 })
}

function testSocketActionsEmitAndSubscribe () {
  const { actions, context, commits, serviceCalls } = makeSocketActionContext()

  actions.selectSong.call(context, {}, 3)
  actions.selectSongProgram.call(context, {}, 2)
  actions.sendEditMode.call(context, {}, 6)
  actions.sendChangePresetVolumeMessage.call(context, {}, { value: 80 })

  assert.deepStrictEqual(serviceCalls.emitted, [
    { eventName: 'VIEW_SONG_MESSAGE', payload: 3 },
    { eventName: 'VIEW_PROGRAM_MESSAGE', payload: 2 },
    { eventName: 'VIEW_EDIT_MODE_MESSAGE', payload: 6 },
    { eventName: 'CONTROLLER_PRESETVOLUME_MESSAGE', payload: { value: 80 } }
  ])

  actions.socketClientInitialize.call(context, { commit: context.commit })
  serviceCalls.socketHandlers.CONTROLLER_PROGRAM_MESSAGE('1')
  serviceCalls.socketHandlers.CONTROLLER_SONG_MESSAGE('10')
  serviceCalls.socketHandlers.CONTROLLER_GIG_MESSAGE('2')
  serviceCalls.socketHandlers.CONTROLLER_PEDAL1_MESSAGE('64')
  serviceCalls.socketHandlers.CONTROLLER_PEDAL2_MESSAGE('65')
  serviceCalls.socketHandlers.CONTROLLER_PRESETVOLUME_MESSAGE('88')

  assert.deepStrictEqual(commits, [
    { type: 'SET_CURRENT_PROGRAMMIDIPEDAL', payload: 1 },
    { type: 'SET_CURRENTSONG_ID', payload: 10 },
    { type: 'SET_SELECTEDGIG_ID', payload: 2 },
    { type: 'SET_PEDAL1VALUE', payload: 64 },
    { type: 'SET_PEDAL2VALUE', payload: 65 },
    { type: 'SET_PRESET_VOLUME_BY_CONTROLLER', payload: 88 }
  ])
}

function testInstrumentImagesInitializedHandlesEmptyList () {
  const getters = makeGettersModule().default

  assert.strictEqual(getters.instrumentListImagesInitialized({ instrumentList: [] }), false)
  assert.strictEqual(getters.instrumentListImagesInitialized({ instrumentList: [{ imageURL: '' }] }), false)
  assert.strictEqual(getters.instrumentListImagesInitialized({ instrumentList: [{ imageURL: 'image.png' }] }), true)
}

function testGettersReturnStateAndPresetLookup () {
  const getters = makeGettersModule().default
  const state = {
    songList: [{ id: 1 }],
    instrumentList: [{ id: 2, imageURL: 'image.png' }],
    presetList: [{ id: 3 }, { id: 3 }, { id: 4 }],
    instrumentBankList: [{ id: 5 }],
    gigList: [{ id: 6 }],
    gigSongList: [{ id: 7 }],
    scheduledGigId: 8,
    selectedGigId: 9,
    currentSongId: 10,
    currentProgramMidiPedal: 11,
    allInitialized: true,
    initialisingIsInProgress: false,
    refreshSong: true,
    defaultPreset: { id: -1 },
    pedal1Value: 12,
    pedal2Value: 13,
    presetVolumeFromController: 14
  }

  assert.deepStrictEqual(getters.songList(state), state.songList)
  assert.deepStrictEqual(getters.instrumentList(state), state.instrumentList)
  assert.deepStrictEqual(getters.presetList(state), state.presetList)
  assert.deepStrictEqual(getters.instrumentBankList(state), state.instrumentBankList)
  assert.deepStrictEqual(getters.gigList(state), state.gigList)
  assert.deepStrictEqual(getters.gigSongList(state), state.gigSongList)
  assert.deepStrictEqual(getters.getPresetById(state)(3), [{ id: 3 }, { id: 3 }])
  assert.strictEqual(getters.scheduledGigId(state), 8)
  assert.strictEqual(getters.selectedGigId(state), 9)
  assert.strictEqual(getters.currentSongId(state), 10)
  assert.strictEqual(getters.currentProgramMidiPedal(state), 11)
  assert.strictEqual(getters.allInitialized(state), true)
  assert.strictEqual(getters.initialisingIsInProgress(state), false)
  assert.strictEqual(getters.instrumentListImagesInitialized(state), true)
  assert.strictEqual(getters.refreshSong(state), true)
  assert.deepStrictEqual(getters.defaultPreset(state), { id: -1 })
  assert.strictEqual(getters.pedal1Value(state), 12)
  assert.strictEqual(getters.pedal2Value(state), 13)
  assert.strictEqual(getters.presetVolumeFromController(state), 14)
}

function testMutationsUpdateState () {
  const mutations = makeMutationsModule().default
  const state = {
    songList: [{ id: 1, name: 'Old', programList: [{ id: 1, tytle: 'A', presetList: [{ id: 1, refpreset: 1, volume: 1 }] }] }],
    instrumentList: [{ id: 1, name: 'Old Instrument' }],
    presetList: [{ id: 1, name: 'Old Preset' }],
    instrumentBankList: [{ id: 1, name: 'Old Bank' }],
    gigList: [{ id: 1, name: 'Old Gig' }],
    gigSongList: [{ id: 1, name: 'Old Gig Song' }],
    allInitialized: false,
    initialisingIsInProgress: false,
    refreshSong: false
  }

  mutations.INIT_ALL(state)
  assert.strictEqual(state.allInitialized, true)
  mutations.INIT_INPROGRESS(state, true)
  assert.strictEqual(state.initialisingIsInProgress, true)
  mutations.SET_SONGLIST(state, [])
  assert.deepStrictEqual(state.songList, [])
  mutations.ADD_SONG(state, { id: 2 })
  assert.deepStrictEqual(state.songList, [{ id: 2 }])
  mutations.UPDATE_SONG(state, { id: 2, name: 'Updated' })
  assert.deepStrictEqual(state.songList[0], { id: 2, name: 'Updated' })
  mutations.REFRESH_SONG(state)
  assert.strictEqual(state.refreshSong, true)
  mutations.ADD_SONG_ITEMS(state, { songId: 2, programs: [{ id: 1 }] })
  assert.deepStrictEqual(state.songList[0].programList, [{ id: 1 }])
  mutations.UPDATE_SONGPROGRAM(state, { refsong: 2, id: 1, tytle: 'Verse' })
  assert.strictEqual(state.songList[0].programList[0].tytle, 'Verse')
  state.songList[0].programList[0].presetList = [{ id: 1 }]
  mutations.UPDATE_SONGPROGRAMPRESET(state, {
    refsong: 2,
    refsongprogram: 1,
    id: 1,
    refpreset: 7,
    volume: 80,
    pan: 64,
    muteflag: 1,
    boostflag: 1,
    reverbflag: 1,
    delayflag: 0,
    modeflag: 1,
    reverbvalue: 5,
    delayvalue: 6
  })
  assert.strictEqual(state.songList[0].programList[0].presetList[0].volume, 80)
  assert.strictEqual(state.songList[0].programList[0].presetList[0].boostflag, 1)

  mutations.SET_INSTRUMENTLIST(state, [])
  mutations.ADD_INSTRUMENT(state, { id: 3 })
  mutations.UPDATE_INSTRUMENT(state, { id: 3, name: 'Updated Instrument' })
  assert.deepStrictEqual(state.instrumentList, [{ id: 3, name: 'Updated Instrument' }])
  mutations.SET_INSTRUMENT_IMAGE(state, [{ id: 3, url: 'image.png' }])
  assert.strictEqual(state.instrumentList[0].imageURL, 'image.png')

  mutations.SET_PRESETLIST(state, [])
  mutations.ADD_PRESET(state, { id: 4 })
  mutations.UPDATE_PRESET(state, { id: 4, name: 'Updated Preset' })
  assert.deepStrictEqual(state.presetList, [{ id: 4, name: 'Updated Preset' }])

  mutations.SET_INSTRUMENTBANKLIST(state, [])
  mutations.ADD_INSTRUMENTBANK(state, { id: 5 })
  mutations.UPDATE_INSTRUMENTBANK(state, { id: 5, name: 'Updated Bank' })
  assert.deepStrictEqual(state.instrumentBankList, [{ id: 5, name: 'Updated Bank' }])

  mutations.SET_GIGLIST(state, [])
  mutations.ADD_GIG(state, { id: 6 })
  mutations.UPDATE_GIG(state, { id: 6, name: 'Updated Gig' })
  mutations.POPULATE_GIG_SONGS(state, { gigId: 6, songs: [{ id: 2 }] })
  assert.deepStrictEqual(state.gigList, [{ id: 6, name: 'Updated Gig', songList: [{ id: 2 }] }])

  mutations.SET_GIGSONGLIST(state, [])
  mutations.ADD_GIGSONG(state, { id: 7 })
  mutations.UPDATE_GIGSONG(state, { id: 7, name: 'Updated Gig Song' })
  assert.deepStrictEqual(state.gigSongList, [{ id: 7, name: 'Updated Gig Song' }])

  mutations.SET_SCHEDULEDGIG_ID(state, 8)
  mutations.SET_SELECTEDGIG_ID(state, 9)
  mutations.SET_CURRENTSONG_ID(state, 10)
  mutations.SET_CURRENT_PROGRAMMIDIPEDAL(state, 11)
  mutations.SET_PEDAL1VALUE(state, 12)
  mutations.SET_PEDAL2VALUE(state, 13)
  mutations.SET_PRESET_VOLUME_BY_CONTROLLER(state, 14)
  assert.strictEqual(state.scheduledGigId, 8)
  assert.strictEqual(state.selectedGigId, 9)
  assert.strictEqual(state.currentSongId, 10)
  assert.strictEqual(state.currentProgramMidiPedal, 11)
  assert.strictEqual(state.pedal1Value, 12)
  assert.strictEqual(state.pedal2Value, 13)
  assert.strictEqual(state.presetVolumeFromController, 14)
}

async function testSongsServiceGetSongItemsMapsSongProgramList () {
  const { SongsService, calls } = makeSongsServiceModule({
    id: 10,
    programList: [{ id: 1 }, { id: 2 }]
  })

  assert.deepStrictEqual(await SongsService.getSongItems(10), {
    songId: 10,
    programs: [{ id: 1 }, { id: 2 }]
  })
  assert.deepStrictEqual(calls, [{ method: 'GET', url: 'song/10' }])
}

async function testSongsServiceMapsApiRequests () {
  const { service, calls } = makeServiceModule('services/SongsService.js', { id: 31, programList: [] })

  assert.deepStrictEqual(await service.getAllData(), { id: 31, programList: [] })
  assert.strictEqual(await service.getId(), 31)
  await service.putSong({
    id: 31,
    name: 'Song',
    ordernumber: 1,
    createdAt: 'old',
    updatedAt: 'new'
  })

  assert.deepStrictEqual(calls, [
    { method: 'GET', url: 'all/song' },
    { method: 'GET', url: 'id/song' },
    {
      method: 'PUT',
      url: 'song/31',
      body: {
        id: 31,
        name: 'Song'
      }
    }
  ])
}

async function testGigsServiceMapsApiRequests () {
  const { service, calls } = makeServiceModule('services/GigsService.js', { id: 4 })
  const gig = {
    id: 4,
    name: 'Gig',
    songList: [{ id: 1 }],
    shortSongList: [{ id: 1 }]
  }

  assert.deepStrictEqual(await service.getAllData(), { id: 4 })
  assert.strictEqual(await service.getId(), 4)
  await service.putGig(gig)
  await service.saveScheduledGigId(4)
  assert.strictEqual(await service.getScheduledGigId(), 4)

  assert.deepStrictEqual(calls, [
    { method: 'GET', url: 'all/gig' },
    { method: 'GET', url: 'id/gig' },
    {
      method: 'PUT',
      url: 'gig/4',
      body: {
        id: 4,
        name: 'Gig',
        shortSongList: [{ id: 1 }]
      }
    },
    { method: 'PUT', url: 'currentgig', body: { id: 4 } },
    { method: 'GET', url: 'currentgig' }
  ])
}

async function testInstrumentServicesMapApiRequests () {
  const instruments = makeServiceModule('services/InstrumentsService.js', { id: 6 })
  const banks = makeServiceModule('services/InstrumentBankService.js', { id: 7 })
  const presets = makeServiceModule('services/PresetsService.js', { id: 8 })
  const presetUsage = makeServiceModule('services/PresetUsageService.js', { usageCount: 1 })

  assert.deepStrictEqual(await instruments.service.getAllData(), { id: 6 })
  assert.strictEqual(await instruments.service.getId(), 6)
  await instruments.service.put({ id: 6, name: 'Instrument' })
  const iconFiles = function () {
    return ''
  }
  iconFiles.keys = function () {
    return ['./image_06.png', './other.png']
  }
  assert.deepStrictEqual(await instruments.service.getInstrumentIcons(iconFiles), [{ id: 6, url: '' }])

  assert.deepStrictEqual(await banks.service.getAllData(), { id: 7 })
  assert.strictEqual(await banks.service.getId(), 7)
  await banks.service.put({ id: 7, name: 'Bank' })

  assert.deepStrictEqual(await presets.service.getAllData(), { id: 8 })
  assert.strictEqual(await presets.service.getId(), 8)
  await presets.service.put({ id: 8, name: 'Preset' })

  assert.deepStrictEqual(await presetUsage.service.getUsage(1, 24), { usageCount: 1 })

  assert.deepStrictEqual(instruments.calls, [
    { method: 'GET', url: 'all/instrument' },
    { method: 'GET', url: 'id/instrument' },
    { method: 'PUT', url: 'instrument/6', body: { id: 6, name: 'Instrument' } }
  ])
  assert.deepStrictEqual(banks.calls, [
    { method: 'GET', url: 'all/instrumentbank' },
    { method: 'GET', url: 'id/instrumentbank' },
    { method: 'PUT', url: 'instrumentbank/7', body: { id: 7, name: 'Bank' } }
  ])
  assert.deepStrictEqual(presets.calls, [
    { method: 'GET', url: 'all/preset' },
    { method: 'GET', url: 'id/preset' },
    { method: 'PUT', url: 'preset/8', body: { id: 8, name: 'Preset' } }
  ])
  assert.deepStrictEqual(presetUsage.calls, [
    { method: 'GET', url: 'presetusage/1/24' }
  ])
}

async function testSingleOrDoubleRowClickCallbacks () {
  const { singleOrDoubleRowClick } = loadSourceModule('helpers/utils.js', {}, {})
  const calls = []
  singleOrDoubleRowClick('a', item => calls.push(`single-${item}`), item => calls.push(`double-${item}`))
  await new Promise(resolve => setTimeout(resolve, 280))
  assert.deepStrictEqual(calls, ['single-a'])

  singleOrDoubleRowClick('b', item => calls.push(`single-${item}`), item => calls.push(`double-${item}`))
  singleOrDoubleRowClick('b', item => calls.push(`single-${item}`), item => calls.push(`double-${item}`))
  await new Promise(resolve => setTimeout(resolve, 280))
  assert.deepStrictEqual(calls, ['single-a', 'double-b'])
}

async function testSongsPanelSaveSongChoosesAddOrUpdate () {
  const component = loadVueComponent('components/SongsPanel.vue', {
    '@/components/SongProgramsPanel': {}
  }, {})
  const context = makeComponentContext(component, {
    closeDialogCalled: 0,
    loadingValues: [],
    closeDialog () {
      this.closeDialogCalled += 1
    },
    showLoading (value) {
      this.loadingValues.push(value)
    }
  })

  context.editedIndex = -1
  context.editedItem = { name: 'New Song' }
  await context.saveSong(null)
  assert.deepStrictEqual(context.dispatches.at(-1), {
    type: 'addSong',
    payload: context.editedItem
  })

  context.editedIndex = 2
  context.editedItem = { id: 10, name: 'Existing Song' }
  await context.saveSong(null)
  assert.deepStrictEqual(context.dispatches.at(-1), {
    type: 'updateSong',
    payload: context.editedItem
  })
  assert.deepStrictEqual(context.loadingValues, [true, false, true, false])
  assert.strictEqual(context.closeDialogCalled, 2)
}

async function testSongsPanelRowClickedLoadsProgramsBeforeExpand () {
  const component = loadVueComponent('components/SongsPanel.vue', {
    '@/components/SongProgramsPanel': {}
  }, {})
  const song = {
    id: 10,
    name: 'Song',
    programList: []
  }
  const context = makeComponentContext(component, {
    songList: [song],
    expanded: [],
    selectedProgramList: []
  })

  await context.rowClicked(song)

  assert.deepStrictEqual(context.dispatches, [{ type: 'addSongItems', payload: 10 }])
  assert.deepStrictEqual(context.expanded, [])

  song.programList = [{ id: 1, tytle: 'A' }]
  await context.rowClicked(song)

  assert.deepStrictEqual(context.selectedProgramList, song.programList)
  assert.deepStrictEqual(context.expanded, [song])
}

async function testPresetsPanelBusinessMethods () {
  const component = loadVueComponent('components/PresetsPanel.vue', {}, {})
  const presetA = {
    id: 1,
    name: 'Clean',
    refinstrument: 1,
    refinstrumentbank: 10,
    midipc: 24
  }
  const presetB = {
    id: 2,
    name: 'Pad',
    refinstrument: 2,
    refinstrumentbank: 20,
    midipc: 42
  }
  const context = makeComponentContext(component, {
    presetList: [presetA, presetB],
    instrumentList: [{ id: 1, name: 'BiasFX' }],
    instrumentBankList: [
      { id: 10, name: 'Bank A', refinstrument: 1 },
      { id: 20, name: 'Bank B', refinstrument: 2 }
    ]
  })

  assert.strictEqual(context.getInstrument(1), 'BiasFX')
  assert.strictEqual(context.getInstrument(99), '')
  assert.strictEqual(context.getInstrumentBank(10), 'Bank A')
  assert.deepStrictEqual(context.getInstrumentPresets(), [presetA, presetB])
  context.selectedInstrumentId = 2
  assert.deepStrictEqual(context.getInstrumentPresets(), [presetB])

  context.editedItem.refinstrument = 1
  assert.deepStrictEqual(context.getBankList(1), [{ id: 10, name: 'Bank A', refinstrument: 1 }])
  assert.strictEqual(context.bankId, 10)

  context.editItem(presetA)
  assert.strictEqual(context.dialog, true)
  assert.strictEqual(context.instrumentId, 1)
  assert.deepStrictEqual(context.editedItem, presetA)

  context.editedIndex = 0
  context.savePreset()
  assert.deepStrictEqual(context.dispatches.at(-1), {
    type: 'updatePreset',
    payload: context.editedItem
  })

  context.editedIndex = -1
  context.editedItem = { name: 'New Preset' }
  context.savePreset()
  assert.deepStrictEqual(context.dispatches.at(-1), {
    type: 'addPreset',
    payload: context.editedItem
  })
}

async function testPresetControlBusinessMethods () {
  const usageCalls = []
  const usageResponse = {
    usageCount: 1,
    usages: [{ songName: 'Matushka' }]
  }
  const component = loadVueComponent('components/globals/PresetControl.vue', {
    '@/services/PresetUsageService': {
      __esModule: true,
      default: {
        async getUsage (instrumentId, midiPc) {
          usageCalls.push({ instrumentId, midiPc })
          return usageResponse
        }
      }
    },
    'lodash/sortBy': (list, key) => [...list].sort((left, right) => String(left[key]).localeCompare(String(right[key])))
  }, {})
  const presetA = {
    id: 2,
    name: 'B Preset',
    refinstrument: 1,
    refinstrumentbank: 10,
    midipc: 24
  }
  const presetB = {
    id: 3,
    name: 'A Preset',
    refinstrument: 1,
    refinstrumentbank: 11,
    midipc: 0
  }
  const context = makeComponentContext(component, {
    presetList: [presetA, presetB],
    instrumentList: [{ id: 1, name: 'BiasFX iPad', imageURL: 'bias.png', midichannel: 6 }],
    songPreset: {
      id: 9,
      refsong: 7,
      refsongprogram: 3,
      refinstrument: 1,
      refinstrumentbank: 10,
      refpreset: 2,
      volume: 80,
      pan: 64
    },
    presetId: 2,
    midichannel: 6
  })
  Object.defineProperty(context, 'selectedPreset', {
    get () {
      return context.presetList.find(item => item.id === context.presetId)
    }
  })
  Object.defineProperty(context, 'selectedPresetInstrumentName', {
    get () {
      return 'BiasFX iPad'
    }
  })

  context.setVolume(72)
  assert.strictEqual(context.songPreset.volume, 72)
  assert.strictEqual(context.getPresetName(), 'B Preset')
  assert.strictEqual(context.getBaseColor(), 'snow')

  await context.populatePresetList(1)
  assert.deepStrictEqual(context.presets.map(item => item.name), ['A Preset', 'B Preset'])

  context.presetId = 3
  context.setPreset()
  assert.strictEqual(context.songPreset.refpreset, 3)
  assert.strictEqual(context.songPreset.refinstrumentbank, 11)
  assert.strictEqual(context.songPreset.volume, 0)
  assert.strictEqual(context.songPreset.pan, 64)

  context.setEditMode(true)
  assert.strictEqual(context.editMode, true)
  assert.deepStrictEqual(context.dispatches.at(-1), { type: 'sendEditMode', payload: 6 })

  context.onPresetClick()
  assert.strictEqual(context.dialog, true)

  await context.showPresetUsage()
  assert.deepStrictEqual(usageCalls, [{ instrumentId: 1, midiPc: 0 }])
  assert.strictEqual(context.usageDialog, true)
  assert.strictEqual(context.usageLoading, false)
  assert.deepStrictEqual(context.presetUsage, usageResponse)

  context.saveSongPreset()
  assert.deepStrictEqual(context.dispatches.at(-2), {
    type: 'updateSongProgramPreset',
    payload: context.songPreset
  })
  assert.deepStrictEqual(context.emitted, [{ eventName: 'changed', payload: true }])
}

async function testGigControlPanelBusinessMethods () {
  const component = loadVueComponent('components/GigControlPanel.vue', {
    '@/components/globals/Metronome': {}
  }, {})
  const songA = {
    id: 10,
    tempo: 120,
    programList: [{
      tytle: 'A',
      presetList: [{ id: 1, refpreset: 2 }]
    }]
  }
  const songB = {
    id: 11,
    tempo: 100,
    programList: [{ tytle: 'B', presetList: [{ id: 2 }] }]
  }
  const context = makeComponentContext(component, {
    defaultPreset: { id: -1 },
    songList: [songA, songB],
    currentSongList: [songA],
    gigList: [
      { id: 1, currentFlag: 1, songList: [songA] },
      { id: 2, shortSongList: [{ id: 11 }, { id: 99 }] }
    ],
    scheduledGigId: 2,
    selectedGigId: 1,
    currentSongId: 10,
    currentGig: { id: 1, songList: [songA] },
    currentSong: songA,
    currentProgramIdx: 0,
    currentPedal1Value: 1,
    currentPedal2Value: 2
  })
  Object.defineProperty(context, 'gigId', {
    get () {
      return this.selectedGigId
    },
    set (value) {
      this.$store.dispatch('setSelectedGigId', value)
    }
  })
  Object.defineProperty(context, 'songId', {
    get () {
      return this.currentSongId
    },
    set (value) {
      if (this.currentSongId !== value && value > 0) {
        this.$store.dispatch('setCurrentSongId', value)
      }
    }
  })

  assert.deepStrictEqual(await context.getGigSongs(context.gigList[1]), [songB])
  assert.deepStrictEqual(context.getPresetControlData(0, 0), { id: 1, refpreset: 2 })
  context.currentSong = null
  assert.deepStrictEqual(context.getPresetControlData(0, 0), context.defaultPreset)
  context.currentSong = songA
  assert.strictEqual(context.getProgramTytle(0), 'A')
  assert.strictEqual(context.checkIfGigIsCurrent(), false)
  assert.strictEqual(context.checkVolumePedal1(0, 1), true)
  assert.strictEqual(context.checkVolumePedal2(0, 2), true)

  context.onProgramClick(3)
  context.selectSong()
  context.saveGigAsCurrent()
  context.saveSong()
  assert.deepStrictEqual(context.dispatches.slice(-4), [
    { type: 'selectSongProgram', payload: 3 },
    { type: 'selectSong', payload: 10 },
    { type: 'setGigAsScheduled', payload: 1 },
    { type: 'updateSong', payload: songA }
  ])
  assert.strictEqual(context.dataChanged, false)

  await context.setGigSong()
  assert.deepStrictEqual(context.dispatches.at(-1), { type: 'setSelectedGigId', payload: 1 })

  context.clearGig()
  assert.strictEqual(context.currentGig, null)
  assert.deepStrictEqual(context.dispatches.at(-1), { type: 'setSelectedGigId', payload: -1 })
}

function testGigControlPanelRoutesPedalHighlightsByInstrumentSlot () {
  const source = readSrcFile('components/GigControlPanel.vue')
  const expected = [
    ":activeVolumePedal='checkVolumePedal1(0, 1)'",
    ":activeVolumePedal='checkVolumePedal2(0, 1)'",
    ":activeVolumePedal='checkVolumePedal1(0, 2)'",
    ":activeVolumePedal='checkVolumePedal2(0, 2)'"
  ]

  for (let pattern of expected) {
    assert(source.includes(pattern), `GigControlPanel.vue should route active pedal highlight with ${pattern}`)
  }

  const firstRow = source.slice(source.indexOf('id="Proram0"'), source.indexOf('id="Proram1"'))
  assert(firstRow.indexOf("checkVolumePedal1(0, 1)") < firstRow.indexOf("checkVolumePedal2(0, 1)"))
  assert(firstRow.indexOf("checkVolumePedal2(0, 1)") < firstRow.indexOf("checkVolumePedal1(0, 2)"))
  assert(firstRow.indexOf("checkVolumePedal1(0, 2)") < firstRow.indexOf("checkVolumePedal2(0, 2)"))
}

function testMyKnobValueWatcherIsImmediateAndNormalizesValues () {
  const component = loadVueComponent('components/globals/MyKnob.vue', {
    '@/helpers/utils': {
      singleOrDoubleRowClick () {}
    }
  }, {})

  assert.strictEqual(component.watch.value.immediate, true)

  const context = makeComponentContext(component, {
    min: 0,
    max: 127,
    currentValue: 0,
    data: null
  })
  context.setCurrentValue(context.limitValue('120'), true)
  assert.strictEqual(context.currentValue, 120)

  context.setCurrentValue(context.limitValue('200'), true)
  assert.strictEqual(context.currentValue, 127)
}

function testVueComponentsUseLengthProperty () {
  const files = [
    'components/SongsPanel.vue',
    'components/GigPanel.vue',
    'components/SongProgramsPanel.vue'
  ]

  for (let file of files) {
    assert(!readSrcFile(file).includes('.lenght'), `${file} uses .lenght instead of .length`)
  }
}

function testGigControlPanelsDoNotDispatchPopulateGigSongsWithRawId () {
  const files = [
    'components/GigControlPanel.vue',
    'components/MobileGigControlPanel.vue'
  ]

  for (let file of files) {
    const source = readSrcFile(file)
    assert(!source.includes("dispatch('populateGigSongs', id)"), `${file} dispatches populateGigSongs with raw id`)
  }
}

function testGigControlPanelsDoNotAssumeCurrentFlagExists () {
  const files = [
    'components/GigControlPanel.vue',
    'components/MobileGigControlPanel.vue'
  ]

  for (let file of files) {
    const source = readSrcFile(file)
    assert(!source.includes('find(g => g.currentFlag === 1).id'), `${file} assumes currentFlag gig exists`)
  }
}

function testReferenceLookupsDoNotDereferenceMissingItemsInline () {
  const checks = [
    {
      file: 'components/SongPresetsPanel.vue',
      patterns: [
        'instrumentList.find(i => i.id === item.refinstrument).imageURL',
        'presetList.find(i => i.id === item.refpreset).name',
        'instrumentBankList.find(i => i.id === item.refinstrumentbank).name'
      ]
    },
    {
      file: 'components/InstrumentBankPanel.vue',
      patterns: [
        'instrumentList.find(i => i.id === item.refinstrument).name'
      ]
    }
  ]

  for (let check of checks) {
    const source = readSrcFile(check.file)
    for (let pattern of check.patterns) {
      assert(!source.includes(pattern), `${check.file} dereferences a possibly missing lookup: ${pattern}`)
    }
  }
}

function testPresetBankAutoSelectUsesFirstMatchingBank () {
  const source = readSrcFile('components/PresetsPanel.vue')

  assert(!source.includes('this.bankId = result.id'), 'PresetsPanel.vue uses result.id instead of result[0].id')
}

function testModulationEffectIsLabeledModInLiveUi () {
  const presetControlSource = readSrcFile('components/globals/PresetControl.vue')
  const songPresetsSource = readSrcFile('components/SongPresetsPanel.vue')

  assert(presetControlSource.includes('label="Mod"'), 'PresetControl.vue should label modulation as Mod')
  assert(!presetControlSource.includes('label="Mode"'), 'PresetControl.vue still labels modulation as Mode')
  assert(songPresetsSource.includes("{ text: 'mod', value: 'modeflag' }"), 'SongPresetsPanel.vue should label modeflag as mod')
  assert(!songPresetsSource.includes("{ text: 'mode', value: 'modeflag' }"), 'SongPresetsPanel.vue still labels modeflag as mode')
}

function testBoostFlagReplacesMuteInPresetUi () {
  const presetControlSource = readSrcFile('components/globals/PresetControl.vue')
  const songPresetsSource = readSrcFile('components/SongPresetsPanel.vue')
  const actionsSource = readSrcFile('store/actions.js')
  const mutationsSource = readSrcFile('store/mutations.js')

  assert(presetControlSource.includes('label="Boost"'), 'PresetControl.vue should label boost as Boost')
  assert(!presetControlSource.includes('label="Mute"'), 'PresetControl.vue still labels the live flag as Mute')
  assert(presetControlSource.includes('v-model="songPreset.boostflag"'), 'PresetControl.vue should bind Boost to boostflag')
  assert(songPresetsSource.includes("{ text: 'boost', value: 'boostflag' }"), 'SongPresetsPanel.vue should show boostflag')
  assert(!songPresetsSource.includes("{ text: 'mute', value: 'muteflag' }"), 'SongPresetsPanel.vue still exposes muteflag as the active column')
  assert(actionsSource.includes("'boostflag': 0"), 'New songs should default boostflag to 0')
  assert(mutationsSource.includes("Vue.set(preset, 'boostflag'"), 'Existing presets should receive boostflag reactively')
}

async function run () {
  const tests = [
    testValidateSongAcceptsValidSong,
    testValidateSongRejectsMissingProgramList,
    testAddNewSongBuildsDefaultProgramsAndPresets,
    testUpdateGigSongCollectionMapsShortSongList,
    testInitializeAllListsMarksInitializationComplete,
    testSimpleListActionsCommitPayloads,
    testAddEntityActionsAssignIdsPersistAndCommit,
    testUpdateSongPersistsBeforeCommit,
    testUpdateInstrumentPersistsPayload,
    testUpdatePresetWaitsForApiBeforeCommit,
    testUpdateInstrumentBankWaitsForApiBeforeCommit,
    testUpdateGigWaitsForApiBeforeCommit,
    testResetGigSongsWaitsForApiBeforeCommit,
    testSetGigAsScheduledWaitsForApiBeforeCommit,
    testAddSongItemsLoadsSongPrograms,
    testSocketActionsEmitAndSubscribe,
    testInstrumentImagesInitializedHandlesEmptyList,
    testGettersReturnStateAndPresetLookup,
    testMutationsUpdateState,
    testSongsServiceGetSongItemsMapsSongProgramList,
    testSongsServiceMapsApiRequests,
    testGigsServiceMapsApiRequests,
    testInstrumentServicesMapApiRequests,
    testSingleOrDoubleRowClickCallbacks,
    testSongsPanelSaveSongChoosesAddOrUpdate,
    testSongsPanelRowClickedLoadsProgramsBeforeExpand,
    testPresetsPanelBusinessMethods,
    testPresetControlBusinessMethods,
    testGigControlPanelBusinessMethods,
    testGigControlPanelRoutesPedalHighlightsByInstrumentSlot,
    testMyKnobValueWatcherIsImmediateAndNormalizesValues,
    testVueComponentsUseLengthProperty,
    testGigControlPanelsDoNotDispatchPopulateGigSongsWithRawId,
    testGigControlPanelsDoNotAssumeCurrentFlagExists,
    testReferenceLookupsDoNotDereferenceMissingItemsInline,
    testPresetBankAutoSelectUsesFirstMatchingBank,
    testModulationEffectIsLabeledModInLiveUi,
    testBoostFlagReplacesMuteInPresetUi
  ]

  const failures = []
  for (let test of tests) {
    try {
      await test()
      console.log(`OK ${test.name}`)
    } catch (err) {
      failures.push({ test, err })
      console.error(`FAIL ${test.name}`)
      console.error(err.message)
    }
  }

  if (failures.length > 0) {
    const summary = failures.map(item => item.test.name).join(', ')
    throw new Error(`${failures.length} test(s) failed: ${summary}`)
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
