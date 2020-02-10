const {Instrument} = require('../models')
module.exports = {
  async index (req, res) {
    try {
      // this.$log.debug("Select>>>>>>>>>Search")
      // this.$log.debug(req.query.search)
      let instruments = null
      const search = req.query.search
      // this.$log.debug(search)
      const Sequelize = require('sequelize');
      const Op = Sequelize.Op;

      if (search) {
        instruments = await Instrument.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        })
      } else {
        instruments = await Instrument.findAll({
          limit: 128
        })
      }
      res.send(instruments)
    } catch (err) {
        res.status(500).send({
        error: 'an error has occured trying to fetch the instruments'
      })
    }
  },

  async show (req, res) {
    try {
      const instrument = await Instrument.findById(req.params.instrumentId)
      res.send(instrument)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the instruments'
      })
    }
  },

  async post (req, res) {
    try {
      let model = req.body
      delete model.id
      //this.$log.debug(model)
      const instrument = await Instrument.create(model)
      // this.$log.debug(instrument)
      res.send(instrument)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the instrument'
      })
    }
  },

  async put (req, res) {
    try {
      // this.$log.debug(req.body)
      await Instrument.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the instrument'
      })
    }
  }
}
