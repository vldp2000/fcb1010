const {Gig} = require('../models')
const {GigSong} = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = {
  async index (req, res) {
    try {
      console.log("Select>>>>>>>>>Search")
      console.log(req.query.search)
      let gigs = null
      const search = req.query.search
      console.log(search)

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
      console.log(err)
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
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to show the gigs'
      })
    }
  },

  async post (req, res) {
    try {
      let model = req.body
      delete model.id
      
      //console.log(model)
      const gig = await Gig.create(model)
      console.log(gig)
      res.send(gig)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to create the gig'
      })
    }
  },

  async put (req, res) {
    try {
      console.log(req.body)
      await Gig.update(req.body, {
        where: {
          id: req.params.id
        }
      })
      res.send(req.body)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to update the gig'
      })
    }
  },

  async selectAll (req, res) {
    try {
      console.log("Select>>>>>>>>>All giga:")
      let gigList = null
      gigList = await Gig.findAll()
      res.send(gigList)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'strange error has occured trying to fetch the gigs'
      })
    }
  },

  async getGigSongs (req, res) {
    try {
      let id = -1
      let gigSongs = {}
      // console.log('----Gig--Song---')
      gigId = req.query.id
      // console.log(gigId)
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
      // console.log(gigSongs)
      res.send(gigSongs)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'an error has occured trying to get the gig song'
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
      // console.log('---current gig ---')
      // console.log(gig)
      res.send(gig)
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'bad error has occured trying to fetch the gigs'
      })
    }
  },
}
