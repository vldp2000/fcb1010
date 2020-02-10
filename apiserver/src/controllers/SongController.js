const {Song} = require('../models')
const {SongProgram} = require('../models')
const {SongProgramPreset} = require('../models')
const {Preset} = require('../models')
const {InstrumentBank} = require('../models')
const {Instrument} = require('../models')

function reqLogger (name, req) {
  // this.$log.debug(` << Request >> ${name}`)
  // this.$log.debug(req.method)
  // this.$log.debug(req.url)
  // this.$log.debug(req.query)
  // this.$log.debug(req.params)
}

module.exports = {

  // SONG ------------------------------------- 
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
          order: [
            ['ordernumber', 'ASC']
          ]
        })
      }
      res.send(songs)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'bad error has occured trying to fetch the songs'
      })
    }
  },

   // ------------------------------------- 
   async post (req, res) {
    try {
      let model = req.body
      delete model.id
      delete model.createdAt
      delete model.updatedAt
      //this.$log.debug(model)
      const song = await Song.create(model)
      //this.$log.debug(song)
      res.send(song)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to create the song'
      })
    }
  },

  async put (req, res) {
    try {
      //this.$log.debug(req.body)
      await Song.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.status(200).send({
        message: 'Ok'
      })
    } catch (err) {
      // this.$log.debug(err)
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
      // this.$log.debug(err)
      res.status(500).send({
        error: 'strange error has occured trying to fetch the songs'
      })
    }
  },

 // SONG PROGRAM------------------------------------- 
 async postSongProgram (req, res) {
  try {
    let model = req.body
    // this.$log.debug(model)
    delete model.id
    // this.$log.debug('------ SongProgram.create(model) -------------')
    // this.$log.debug(model)
    const songProgram = await SongProgram.create(model)
    // this.$log.debug(songProgram)
    res.send(songProgram)
  } catch (err) {
    // this.$log.debug(err)
    res.status(500).send({
      error: 'an error has occured trying to create the song'
    })
  }
},

async putSongProgram (req, res) {
  try {
    //this.$log.debug(req.body)
    await SongProgram.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    res.status(200).send({
      message: 'Ok'
    })
  } catch (err) {
    // this.$log.debug(err)
    res.status(500).send({
      error: 'an error has occured trying to update the song'
    })
  }
},

  // ------- Song Items -------------------------------
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
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to get the song items'
      })
    }
  },

  async postSongProgramPreset (req, res) {
    try {
      // this.$log.debug('=======  postSongProgramPreset ======= = ')
      let model = req.body
      // this.$log.debug(model)
      delete model.id
      // delete model.createdAt
      // delete model.updatedAt
      // this.$log.debug(model)
      const songProgramPreset = await SongProgramPreset.create(model)
      //this.$log.debug(song)
      res.send(songProgramPreset)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to create the SongProgramPreset'
      })
    }
  },
  // ------------------------------------- 
  async putSongProgramPreset (req, res) {
    try {
      //this.$log.debug(req.body)
      await SongProgramPreset.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.status(200).send({
        message: 'Ok'
      })
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to update the SongProgramPreset'
      })
    }
  },

 
  async getSongProgramPresetsExtended (req, res) {
    try {
      // this.$log.debug('........async getPresetsExtended')
      const result = await SongProgramPreset.findAll({
        attributes:[
          "id",
          "refsong",
          "refsongprogram",
          "refpreset",
          "volume",
          "pan",
          "muteflag",
          "reverbflag",
          "delayflag",
          "modeflag",
          "reverbvalue",
          "delayvalue"
        ],
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
      // this.$log.debug(result)
      res.send(result)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to getSongProgramPresetsExtended '
      })
    }
  }

}
