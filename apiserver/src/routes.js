const SongController = require('./controllers/SongController')
const InstrumentController = require('./controllers/InstrumentController')
const PresetController = require('./controllers/PresetController')
const InstrumentBankController = require('./controllers/InstrumentBankController')
const GigController = require('./controllers/GigController')

module.exports = (app) => {
  app.get('/songs',
    SongController.index)
  app.get('/songitems/:id',
    SongController.getSongItems)
  app.put('/song/:id',
    SongController.put)
  app.post('/song',
    SongController.post)

  app.get('/instruments',
    InstrumentController.index)
  app.get('/instrument/:id',
    InstrumentController.show)
  app.put('/instrument/:id',
    InstrumentController.put)
  app.post('/instrument',
    InstrumentController.post)

  app.get('/presets',
    PresetController.index)
  app.get('/preset/:id',
    PresetController.show)
  app.put('/preset/:id',
    PresetController.put)
  app.post('/preset',
    PresetController.post)    

  app.get('/instrumentBanks',
    InstrumentBankController.index)
  app.get('/instrumentBank/:id',
    InstrumentBankController.show)
  app.put('/instrumentBank/:id',
    InstrumentBankController.put)
  app.post('/instrumentBank',
    InstrumentBankController.post)

  app.get('/gigs',
    GigController.index)
  app.get('/gig/:id',
    GigController.show)
  app.put('/gig/:id',
    GigController.put)
  app.post('/gig',
    GigController.post)
  app.get('/gigsongs',
    GigController.getGigSongs)

}
