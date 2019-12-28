const SongsController = require('./controllers/SongsController')
const InstrumentsController = require('./controllers/InstrumentsController')
const PresetsController = require('./controllers/PresetsController')

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

  app.get('/presets',
    PresetsController.index)
  app.get('/preset/:id',
    PresetsController.show)
  app.put('/preset/:id',
    PresetsController.put)
  app.post('/preset',
    PresetsController.post)    
}
