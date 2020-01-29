const {Preset} = require('../models')
const {InstrumentBank} = require('../models')
const {Instrument} = require('../models')

module.exports = {
  async index (req, res) {
    try {
      let presets = null
      const search = req.query.search
      const Sequelize = require('sequelize');
      const Op = Sequelize.Op;

      if (search) {
        presets = await Preset.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        })
      } else {
        console.log("Select all presets")
        presets = await Preset.findAll({
          limit: 128
        })
      }
      res.send(presets)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'bad error has occured trying to fetch the presets'
      })
    }
  },

  async show (req, res) {
    try {
      const preset = await Preset.findById(req.params.presetId)
      res.send(preset)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to show the presets'
      })
    }
  },

  async post (req, res) {
    try {
      let model = req.body
      delete model.id
      //console.log(model)
      const preset = await Preset.create(model)
      console.log(preset)
      res.send(preset)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the preset'
      })
    }
  },

  async put (req, res) {
    try {
      console.log(req.body)
      await Preset.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to update the preset'
      })
    }
  },

  async selectAll (req, res) {
    try {
      console.log("Select>>>>>>>>>All preseta:")
      let presetList = null
      presetList = await Preset.findAll()
      res.send(presetList)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'strange error has occured trying to fetch the presets'
      })
    }
  },

  async getPresetsExtended (req, res) {
    try {
      //await reqLogger('== Get ==', req)
      console.log('........async getPresetsExtended')
      const result = await Preset.findAll({
        include: [{
          model: InstrumentBank
        }, {
          model: Instrument
        }]
      })
      console.log(result)
      res.send(result)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to get the extended '
      })
    }
  }

}
