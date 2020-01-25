const {Song} = require('../models')
const {SongProgram} = require('../models')
const {SongProgramPreset} = require('../models')
const {Preset} = require('../models')
const {InstrumentBank} = require('../models')
const {Instrument} = require('../models')

function reqLogger (name, req) {
  console.log(` << Request >> ${name}`)
  console.log(req.method)
  console.log(req.url)
  console.log(req.query)
  console.log(req.params)
}

module.exports = {

  async index (req, res) {
    try {

      //await reqLogger('== Index ', req)

      let songs = null
      const search = req.query.search
      const Sequelize = require('sequelize');
      const Op = Sequelize.Op;

      if (search) {
        songs = await Song.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        })
      } else {
        songs = await Song.findAll({
          limit: 128
        })
      }
      res.send(songs)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'bad error has occured trying to fetch the songs'
      })
    }
  },

  async getSongItems (req, res) {
    req.params.songId
    try {
      //await reqLogger('== Get ==', req)

      const songPrograms = await SongProgram.findAll({
        where: { 
          refsong: req.params.id
        }
      })

      const songProgramPresets = await SongProgramPreset.findAll({
        where: { 
          refsong: req.params.id
        }
      })
      let requestedItems = {
        'songPrograms': songPrograms, 
        'songProgramPresets':songProgramPresets 
      }

      res.send(requestedItems)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to get the song items'
      })
    }
  },

  async post (req, res) {
    try {
      let model = req.body
      delete model.id
      delete model.createdAt
      delete model.updatedAt
      //console.log(model)
      const song = await Song.create(model)
      //console.log(song)
      res.send(song)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the song'
      })
    }
  },

  async put (req, res) {
    try {
      //console.log(req.body)
      await Song.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to update the song'
      })
    }
  },

  async selectAll (req, res) {
    try {
      //reqLogger('== select All == ', req)

      let songList = null
      songList = await Song.findAll()
      res.send(songList)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'strange error has occured trying to fetch the songs'
      })
    }
  },
  async getSongProgramPresetsExtended (req, res) {
    try {
      // console.log('........async getPresetsExtended')
      const result = await SongProgramPreset.findAll({
        include: [{
          model: InstrumentBank,
          attributes: ['number','id'],
        }, {
          model: Instrument,
          attributes: ['midichannel','id'],
        }, {
          model: Preset,
          attributes: ['midipc','id'],
        }, {
          model: SongProgram,
          attributes: ['name','id', 'midipedal'],
        }],
        order: [
          ['refsong', 'ASC'],
          [SongProgram, 'midipedal', 'ASC'],
          [Instrument, 'id', 'ASC']
        ]

      })
      // console.log(result)
      res.send(result)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to getSongProgramPresetsExtended '
      })
    }
  }

}
