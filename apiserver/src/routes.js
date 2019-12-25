const SongsController = require('./controllers/SongsController')

module.exports = (app) => {
  app.get('/songs',
    SongsController.index)
  app.get('/song/:songId',
    SongsController.show)
  app.put('/song/:songId',
    SongsController.put)
  app.post('/song',
    SongsController.post)
}
