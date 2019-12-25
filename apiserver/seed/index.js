const {
  sequelize,
  Song,
  User,
  Bookmark,
  History
} = require('../src/models')

const Promise = require('bluebird')
const song = require('./song.json')
const users = require('./users.json')


sequelize.sync({force: true})
  .then(async function () {
    await Promise.all(
      users.map(user => {
        User.create(user)
      })
    )

    await Promise.all(
      song.map(song => {
        console.log('>>>> map song<<<<<<<<<')
        console.log(song)
        Song.create(song)
      })
    )
  })
