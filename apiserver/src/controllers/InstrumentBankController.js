const {InstrumentBank} = require('../models')
module.exports = {
  async index (req, res) {
    try {
      console.log("Select>>>>>>>>>Search")
      console.log(req.query.search)
      let instrumentBanks = null
      const search = req.query.search
      console.log(search)
      const Sequelize = require('sequelize');
      const Op = Sequelize.Op;

      if (search) {
        instrumentBanks = await InstrumentBank.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        })
      } else {
        instrumentBanks = await InstrumentBank.findAll({
          limit: 128
        })
      }
      res.send(instrumentBanks)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to fetch the instrumentBanks'
      })
    }
  },

  async show (req, res) {
    try {
      const instrumentBank = await InstrumentBank.findById(req.params.instrumentBankId)
      res.send(instrumentBank)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to show the instrumentBanks'
      })
    }
  },

  async post (req, res) {
    try {
      let model = req.body
      console.log(model)
      delete model.id
      console.log(model)
      const instrumentBank = await InstrumentBank.create(model)
      console.log(instrumentBank)
      res.send(instrumentBank)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the instrumentBank'
      })
    }
  },

  async put (req, res) {
    try {
      console.log(req.body)
      await InstrumentBank.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to update the instrumentBank'
      })
    }
  }
}
