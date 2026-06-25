const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')

const tempRoot = path.join(os.tmpdir(), `fcb-api-test-${Date.now()}-${Math.random().toString(36).slice(2)}`)
fs.mkdirSync(tempRoot, { recursive: true })
process.env.FCB_DATA_PATH = tempRoot

const PresetUsageController = require('../src/controllers/PresetUsageController')
const ReadDataController = require('../src/controllers/ReadDataController')
const SaveDataController = require('../src/controllers/SaveDataController')
const routes = require('../src/routes')

function writeJson (fileName, data) {
  fs.writeFileSync(fileName, JSON.stringify(data), 'utf8')
}

function makeResponse () {
  return {
    statusCode: 200,
    payload: null,
    status (statusCode) {
      this.statusCode = statusCode
      return this
    },
    send (payload) {
      this.payload = payload
      return this
    }
  }
}

async function callGetPresetUsage (instrumentId, midiPc) {
  const res = makeResponse()
  await PresetUsageController.getPresetUsage({
    params: {
      instrumentId: String(instrumentId),
      midiPc: String(midiPc)
    }
  }, res)
  return res
}

function createDataFolders () {
  fs.rmSync(tempRoot, { recursive: true, force: true })
  fs.mkdirSync(path.join(tempRoot, 'preset'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'preset', 'id'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'song'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'song', 'id'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'instrument'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'instrument', 'id'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'instrumentbank'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'instrumentbank', 'id'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'gig'), { recursive: true })
  fs.mkdirSync(path.join(tempRoot, 'gig', 'id'), { recursive: true })
}

function createInitialData () {
  createDataFolders()
  writeJson(path.join(tempRoot, 'preset', '120.json'), {
    id: 120,
    name: '24.Drive Fat',
    refinstrument: 1,
    midipc: 24
  })
  writeJson(path.join(tempRoot, 'preset', '121.json'), {
    id: 121,
    name: '24.Drive Fat Copy',
    refinstrument: 1,
    midipc: 24
  })
  writeJson(path.join(tempRoot, 'preset', '220.json'), {
    id: 220,
    name: '42.String Pad',
    refinstrument: 2,
    midipc: 42
  })
  writeJson(path.join(tempRoot, 'song', '7.json'), {
    id: 7,
    name: 'Faun oo',
    programList: [
      {
        id: 3,
        name: 'C',
        presetList: [
          {
            id: 9,
            refinstrument: 1,
            refpreset: 120,
            volume: 91
          },
          {
            id: 10,
            refinstrument: 2,
            refpreset: 220,
            volume: 66
          }
        ]
      }
    ]
  })
  writeJson(path.join(tempRoot, 'instrument', '1.json'), {
    id: 1,
    name: 'BiasFX iPad',
    midichannel: 6
  })
  writeJson(path.join(tempRoot, 'instrument', '2.json'), {
    id: 2,
    name: 'Alchemy',
    midichannel: 2
  })
  writeJson(path.join(tempRoot, 'gig', '2.json'), {
    id: 2,
    name: 'Sydney2024'
  })
  writeJson(path.join(tempRoot, 'gig', 'id', 'currentgig.json'), {
    id: 2
  })
  writeJson(path.join(tempRoot, 'song', 'id', 'id.json'), {
    id: 30
  })
  writeJson(path.join(tempRoot, 'preset', 'id', 'id.json'), {
    id: 300
  })
  fs.writeFileSync(path.join(tempRoot, 'song', 'notes.txt'), 'ignored', 'utf8')
}

async function withFreshData (test) {
  PresetUsageController.invalidateCache()
  createInitialData()
  await test()
}

async function testPresetUsageByActualPreset () {
  const res = await callGetPresetUsage(1, 24)

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.payload.instrumentId, 1)
  assert.strictEqual(res.payload.midiPc, 24)
  assert.strictEqual(res.payload.usageCount, 1)
  assert.strictEqual(res.payload.usages[0].songName, 'Faun oo')
  assert.strictEqual(res.payload.usages[0].programName, 'C')
  assert.strictEqual(res.payload.usages[0].presetName, '24.Drive Fat')
  assert.strictEqual(res.payload.usages[0].volume, 91)
}

async function testPresetUsageIncludesPresetCopiesWithSamePc () {
  writeJson(path.join(tempRoot, 'song', '8.json'), {
    id: 8,
    name: 'Second Song',
    programList: [
      {
        id: 1,
        name: 'Intro',
        presetList: [
          {
            id: 1,
            refinstrument: 1,
            refpreset: 121,
            volume: 77
          }
        ]
      }
    ]
  })

  const res = await callGetPresetUsage(1, 24)

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.payload.usageCount, 2)
  assert.deepStrictEqual(
    res.payload.usages.map(usage => usage.songName).sort(),
    ['Faun oo', 'Second Song']
  )
}

async function testPresetUsageValidation () {
  const res = makeResponse()
  await PresetUsageController.getPresetUsage({
    params: {
      instrumentId: 'abc',
      midiPc: '24'
    }
  }, res)

  assert.strictEqual(res.statusCode, 400)
  assert.strictEqual(res.payload.error, 'instrumentId and midiPc must be numbers')
}

async function testPresetUsageReturnsEmptyUsageList () {
  const res = await callGetPresetUsage(6, 127)

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.payload.usageCount, 0)
  assert.deepStrictEqual(res.payload.usages, [])
}

async function testPresetUsageSkipsBrokenSongReferences () {
  writeJson(path.join(tempRoot, 'song', '9.json'), {
    id: 9,
    name: 'Broken References',
    programList: [
      null,
      {
        id: 1,
        tytle: 'Legacy title'
      },
      {
        id: 2,
        tytle: 'Uses Missing Preset',
        presetList: [
          {
            id: 1,
            refinstrument: 1,
            refpreset: 999,
            volume: 50
          }
        ]
      },
      {
        id: 3,
        tytle: 'Legacy D',
        presetList: [
          {
            id: 2,
            refinstrument: 1,
            refpreset: 120,
            volume: 82
          }
        ]
      }
    ]
  })

  PresetUsageController.invalidateCache()
  const res = await callGetPresetUsage(1, 24)

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.payload.usageCount, 2)
  assert(res.payload.usages.find(usage => usage.programName === 'Legacy D'))
}

async function testSaveDataInvalidatesPresetUsageCache () {
  let res = await callGetPresetUsage(2, 42)
  assert.strictEqual(res.payload.usageCount, 1)

  const updatedSong = {
    id: 7,
    name: 'Faun oo',
    programList: [
      {
        id: 3,
        name: 'C',
        presetList: [
          {
            id: 10,
            refinstrument: 2,
            refpreset: 220,
            volume: 66
          }
        ]
      },
      {
        id: 4,
        name: 'D',
        presetList: [
          {
            id: 11,
            refinstrument: 2,
            refpreset: 220,
            volume: 72
          }
        ]
      }
    ]
  }

  res = makeResponse()
  await SaveDataController.saveDataToFile({
    url: '/song/7',
    params: {
      id: 7
    },
    body: updatedSong
  }, res)

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(tempRoot, 'song', '7.json'), 'utf8')), updatedSong)

  res = await callGetPresetUsage(2, 42)
  assert.strictEqual(res.payload.usageCount, 2)
}

async function testSaveDataWritesNonPresetDataWithoutInvalidatingPresetUsageCache () {
  let invalidateCalls = 0
  const originalInvalidateCache = PresetUsageController.invalidateCache
  PresetUsageController.invalidateCache = function () {
    invalidateCalls += 1
    originalInvalidateCache()
  }

  try {
    const res = makeResponse()
    const instrument = {
      id: 3,
      name: 'SampleTank',
      midichannel: 1
    }

    await SaveDataController.saveDataToFile({
      url: '/instrument/3',
      params: {
        id: 3
      },
      body: instrument
    }, res)

    assert.strictEqual(res.statusCode, 200)
    assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(tempRoot, 'instrument', '3.json'), 'utf8')), instrument)
    assert.strictEqual(invalidateCalls, 0)
  } finally {
    PresetUsageController.invalidateCache = originalInvalidateCache
  }
}

async function testSaveDataReturns500WhenFolderIsMissing () {
  const res = makeResponse()

  await SaveDataController.saveDataToFile({
    url: '/missing/1',
    params: {
      id: 1
    },
    body: {
      id: 1
    }
  }, res)

  assert.strictEqual(res.statusCode, 500)
  assert(res.payload.error.includes('an error has occured trying to save data'))
}

async function testSaveScheduledGigId () {
  const res = makeResponse()
  await SaveDataController.saveScheduledGigId({
    body: {
      id: 2
    }
  }, res)

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(
    JSON.parse(fs.readFileSync(path.join(tempRoot, 'gig', 'id', 'currentgig.json'), 'utf8')),
    { id: 2 }
  )
}

async function testSaveScheduledGigIdReturns500WhenFolderIsMissing () {
  fs.rmSync(path.join(tempRoot, 'gig', 'id'), { recursive: true, force: true })

  const res = makeResponse()
  await SaveDataController.saveScheduledGigId({
    body: {
      id: 3
    }
  }, res)

  assert.strictEqual(res.statusCode, 500)
  assert(res.payload.error.includes('an error has occured trying to save data'))
}

async function testReadDataFromFileReadsAllJsonFilesOnly () {
  const res = makeResponse()
  await ReadDataController.readDataFromFile({
    url: '/all/song',
    params: {}
  }, res)

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.payload.map(song => song.id), [7])
}

async function testReadDataByIdFromFileReadsSingleObject () {
  const res = makeResponse()
  await ReadDataController.readDataByIdFromFile({
    url: '/song/7',
    params: {
      id: 7
    }
  }, res)

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.payload.id, 7)
  assert.strictEqual(res.payload.name, 'Faun oo')
}

async function testReadDataFromFileReadsSingleObjectWhenIdProvided () {
  const res = makeResponse()
  await ReadDataController.readDataFromFile({
    url: '/all/song/7',
    params: {
      id: 7
    }
  }, res)

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(res.payload.id, 7)
  assert.strictEqual(res.payload.name, 'Faun oo')
}

async function testGetIdReturnsCurrentIdAndIncrementsStoredId () {
  const res = makeResponse()
  await ReadDataController.getId({
    url: '/id/song'
  }, res)

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.payload, { id: 30 })

  await new Promise(resolve => setTimeout(resolve, 20))
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(tempRoot, 'song', 'id', 'id.json'), 'utf8')), { id: 31 })
}

async function testGetScheduledGigIdReadsCurrentGig () {
  const res = makeResponse()
  await ReadDataController.getScheduledGigId({}, res)

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.payload, { id: 2 })
}

function testRoutesRegisterApiBusinessEndpoints () {
  const registeredRoutes = []
  routes({
    get (routePath, handler) {
      registeredRoutes.push({ method: 'GET', routePath, handler })
    },
    put () {}
  })

  assert.deepStrictEqual(registeredRoutes, [
    { method: 'GET', routePath: '/song/:id', handler: ReadDataController.readDataByIdFromFile },
    { method: 'GET', routePath: '/all/song', handler: ReadDataController.readDataFromFile },
    { method: 'GET', routePath: '/id/song', handler: ReadDataController.getId },
    { method: 'GET', routePath: '/all/instrument', handler: ReadDataController.readDataFromFile },
    { method: 'GET', routePath: '/id/instrument', handler: ReadDataController.getId },
    { method: 'GET', routePath: '/all/preset', handler: ReadDataController.readDataFromFile },
    { method: 'GET', routePath: '/id/preset', handler: ReadDataController.getId },
    { method: 'GET', routePath: '/presetusage/:instrumentId/:midiPc', handler: PresetUsageController.getPresetUsage },
    { method: 'GET', routePath: '/all/instrumentbank', handler: ReadDataController.readDataFromFile },
    { method: 'GET', routePath: '/id/instrumentbank', handler: ReadDataController.getId },
    { method: 'GET', routePath: '/all/gig', handler: ReadDataController.readDataFromFile },
    { method: 'GET', routePath: '/id/gig', handler: ReadDataController.getId },
    { method: 'GET', routePath: '/gig/:id', handler: ReadDataController.readDataByIdFromFile },
    { method: 'GET', routePath: '/currentgig', handler: ReadDataController.getScheduledGigId }
  ])
}

function testRoutesRegisterApiWriteEndpoints () {
  const registeredRoutes = []
  routes({
    get () {},
    put (routePath, handler) {
      registeredRoutes.push({ method: 'PUT', routePath, handler })
    }
  })

  assert.deepStrictEqual(registeredRoutes, [
    { method: 'PUT', routePath: '/song/:id', handler: SaveDataController.saveDataToFile },
    { method: 'PUT', routePath: '/instrument/:id', handler: SaveDataController.saveDataToFile },
    { method: 'PUT', routePath: '/preset/:id', handler: SaveDataController.saveDataToFile },
    { method: 'PUT', routePath: '/instrumentbank/:id', handler: SaveDataController.saveDataToFile },
    { method: 'PUT', routePath: '/gig/:id', handler: SaveDataController.saveDataToFile },
    { method: 'PUT', routePath: '/currentgig', handler: SaveDataController.saveScheduledGigId }
  ])
}

async function run () {
  try {
    const tests = [
      testPresetUsageByActualPreset,
      testPresetUsageIncludesPresetCopiesWithSamePc,
      testPresetUsageValidation,
      testPresetUsageReturnsEmptyUsageList,
      testPresetUsageSkipsBrokenSongReferences,
      testSaveDataInvalidatesPresetUsageCache,
      testSaveDataWritesNonPresetDataWithoutInvalidatingPresetUsageCache,
      testSaveDataReturns500WhenFolderIsMissing,
      testSaveScheduledGigId,
      testSaveScheduledGigIdReturns500WhenFolderIsMissing,
      testReadDataFromFileReadsAllJsonFilesOnly,
      testReadDataByIdFromFileReadsSingleObject,
      testReadDataFromFileReadsSingleObjectWhenIdProvided,
      testGetIdReturnsCurrentIdAndIncrementsStoredId,
      testGetScheduledGigIdReadsCurrentGig,
      testRoutesRegisterApiBusinessEndpoints,
      testRoutesRegisterApiWriteEndpoints
    ]

    for (let test of tests) {
      await withFreshData(test)
      console.log(`OK ${test.name}`)
    }
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true })
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
