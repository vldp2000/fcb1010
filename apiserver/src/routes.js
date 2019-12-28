const SongsController = require('./controllers/SongsController')
const InstrumentsController = require('./controllers/InstrumentsController')

module.exports = (app) => {
  app.get('/songs',
    SongsController.index)
  app.get('/song/:id',
    SongsController.show)
  app.put('/song/:id',
    SongsController.put)
  app.post('/song',
    SongsController.post)

  app.get('/instruments',
    InstrumentsController.index)
  app.get('/instrument/:id',
    InstrumentsController.show)
  app.put('/instrument/:id',
    InstrumentsController.put)
  app.post('/instrument',
    InstrumentsController.post)
}
