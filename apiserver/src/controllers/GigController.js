const {Gig} = require('../models')
const {GigSong} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  async index (req, res) {
    try {
      // this.$log.debug("Select>>>>>>>>>Search")
      // this.$log.debug(req.query.search)
      let gigs = null
      const search = req.query.search
      // this.$log.debug(search)

      if (search) {
        gigs = await Gig.findAll({
          where: {
            name: {
              [Op.like]: `%${search}%`
            }
          }
        })
      } else {
        gigs = await Gig.findAll({
          limit: 128
        })
      }
      res.send(gigs)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'bad error has occured trying to fetch the gigs'
      })
    }
  },

  async show (req, res) {
    try {
      const gig = await Gig.findById(req.params.gigId)
      res.send(gig)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to show the gigs'
      })
    }
  },

  async post (req, res) {
    try {
      let model = req.body
      delete model.id
      
      // this.$log.debug(model)
      const gig = await Gig.create(model)
      // this.$log.debug(gig)
      res.send(gig)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to create the gig'
      })
    }
  },

  async put (req, res) {
    try {
      // this.$log.debug(req.body)
      await Gig.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to update the gig'
      })
    }
  },

  async selectAll (req, res) {
    try {
      // this.$log.debug("Select>>>>>>>>>All giga:")
      let gigList = null
      gigList = await Gig.findAll()
      res.send(gigList)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'strange error has occured trying to fetch the gigs'
      })
    }
  },

  async getGigSongs (req, res) {
    try {
      let id = -1
      let gigSongs = {}
      // this.$log.debug('----Gig--Song---')
      gigId = req.query.id
      // this.$log.debug(gigId)
      if (gigId > 0) {
        gigSongs =  await GigSong.findAll({
          where: {
            refgig: gigId
          },
          order: [
            ['sequencenumber', 'ASC']
          ]
        })
      } else {
        gigSongs =  await GigSong.findAll()
      }
      // this.$log.debug(gigSongs)
      res.send(gigSongs)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to get the gig song'
      })
    }
  },

  async putGigSong (req, res) {
    try {
      // this.$log.debug(req.body)
      await GigSong.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to update the GigSong'
      })
    }
  },

  async postGigSong (req, res) {
    try {
      let model = req.body
      delete model.id
      
      // this.$log.debug(model)
      const gigSong = await GigSong.create(model)
      // this.$log.debug(gigSong)
      res.send(gigSong)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to create the GigSong'
      })
    }
  },

  async deleteGigSong (req, res) {
    try {
      // this.$log.debug(' --- delete ---')
      // this.$log.debug(req.params.id)
      // this.$log.debug(req.body)
      await GigSong.destroy({
        where: {
          id: req.params.id
        }
      })
      res.status(200).send({
        messager: 'GigSong deleted'
      })
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'an error has occured trying to update the GigSong'
      })
    }
  },

  async currentgig (req, res) {
    try {
      let gig = null
      gig = await Gig.findAll({
        where: {
          currentFlag: 1
        }
      })
      // this.$log.debug('---current gig ---')
      // this.$log.debug(gig)
      res.send(gig)
    } catch (err) {
      // this.$log.debug(err)
      res.status(500).send({
        error: 'bad error has occured trying to fetch the gigs'
      })
    }
  },
}
