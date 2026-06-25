const config = require('../config/config')
const fs = require('fs')
const { resolve } = require('path')
const promisify = require('promisify-node')

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

let cacheLoaded = false
let presetList = []
let songList = []
let presetById = {}
let usageByActualPreset = {}

function getUsageKey (instrumentId, midiPc) {
  return `${parseInt(instrumentId)}:${parseInt(midiPc)}`
}

async function readAllFiles (objName) {
  const folder = resolve(config.filePath + objName)
  const files = await readdir(folder) || []
  const result = []

  for (let file of files) {
    if (!file.endsWith('.json')) continue

    const fileName = `${folder}/${file}`
    const fileContent = await readFile(fileName, 'utf8')
    result.push(JSON.parse(fileContent))
  }

  return result
}

function buildPresetLookup () {
  presetById = {}
  for (let preset of presetList) {
    presetById[parseInt(preset.id)] = preset
  }
}

function buildUsageIndex () {
  usageByActualPreset = {}

  for (let song of songList) {
    if (!song.programList) continue

    for (let program of song.programList) {
      if (!program || !program.presetList) continue

      for (let songPreset of program.presetList) {
        const preset = presetById[parseInt(songPreset.refpreset)]
        if (!preset) continue

        const key = getUsageKey(preset.refinstrument, preset.midipc)
        if (!usageByActualPreset[key]) {
          usageByActualPreset[key] = []
        }

        usageByActualPreset[key].push({
          songId: song.id,
          songName: song.name,
          programId: program.id,
          programName: program.name || program.tytle,
          songPresetId: songPreset.id,
          refinstrument: songPreset.refinstrument,
          refpreset: songPreset.refpreset,
          presetName: preset.name,
          midiPc: preset.midipc,
          volume: songPreset.volume
        })
      }
    }
  }
}

async function loadCache () {
  if (cacheLoaded) return

  presetList = await readAllFiles('preset')
  songList = await readAllFiles('song')
  buildPresetLookup()
  buildUsageIndex()
  cacheLoaded = true
}

function invalidateCache () {
  cacheLoaded = false
  presetList = []
  songList = []
  presetById = {}
  usageByActualPreset = {}
}

module.exports = {
  invalidateCache,

  async getPresetUsage (req, res) {
    try {
      const instrumentId = parseInt(req.params.instrumentId)
      const midiPc = parseInt(req.params.midiPc)

      if (Number.isNaN(instrumentId) || Number.isNaN(midiPc)) {
        res.status(400).send({
          error: 'instrumentId and midiPc must be numbers'
        })
        return
      }

      await loadCache()

      const key = getUsageKey(instrumentId, midiPc)
      const usages = usageByActualPreset[key] || []

      res.send({
        instrumentId,
        midiPc,
        usageCount: usages.length,
        usages
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: `an error has occured trying to read preset usage ${err}`
      })
    }
  }
}
