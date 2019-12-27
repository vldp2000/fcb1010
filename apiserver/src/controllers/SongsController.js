const {Song} = require('../models')
module.exports = {
  async index (req, res) {
    try {
      console.log("Select>>>>>>>>>Search")
      console.log(req.query.search)
      let songs = null
      const search = req.query.search
      console.log(search)
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
      res.status(500).send({
        error: 'bad error has occured trying to fetch the songs'
      })
    }
  },

  async show (req, res) {
    try {
      const song = await Song.findById(req.params.songId)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to show the songs'
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
      console.log(song)
      res.send(song)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to create the song'
      })
    }
  },

  async put (req, res) {
    try {
      await Song.update(req.body, {
        where: {
          id: req.params.songId
        }
      })
      res.send(req.body)
    } catch (err) {
      res.status(500).send({
        error: 'an error has occured trying to update the song'
      })
    }
  },

  async selectAll (req, res) {
    try {
      console.log("Select>>>>>>>>>All songa:")
      let songList = null
      songList = await Song.findAll()
      res.send(songList)
    } catch (err) {
      res.status(500).send({
        error: 'strange error has occured trying to fetch the songs'
      })
    }
  }
}
