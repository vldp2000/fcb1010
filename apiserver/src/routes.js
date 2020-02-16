const SongController = require('./controllers/SongController')
const InstrumentController = require('./controllers/InstrumentController')
const PresetController = require('./controllers/PresetController')
const InstrumentBankController = require('./controllers/InstrumentBankController')
const GigController = require('./controllers/GigController')
const SaveDataController = require('./controllers/SaveDataController')
const ReadDataController = require('./controllers/ReadDataController')

module.exports = (app) => {
  // app.get('/songs', SongController.index)
  // app.get('/songitems/:id', SongController.getSongItems)
  app.put('/song/:id', SaveDataController.saveDataToFile)
  // app.post('/song', SongController.post)
  app.get('/all/song', ReadDataController.readDataFromFile)
  app.get('/id/song', ReadDataController.getId)

  // app.post('/songprogram', SongController.postSongProgram)
  // app.put('/songprogram/:id', SongController.putSongProgram)

  // app.get('/songprogrampreset', SongController.getSongProgramPresetsExtended)
  // app.post('/songprogrampreset', SongController.postSongProgramPreset)
  // app.put('/songprogrampreset/:id', SongController.putSongProgramPreset)

  // app.get('/instruments', InstrumentController.index)
  // app.get('/instrument/:id', InstrumentController.show)
  app.put('/instrument/:id', SaveDataController.saveDataToFile)
  // app.post('/instrument', InstrumentController.post)
  app.get('/all/instrument', ReadDataController.readDataFromFile)
  app.get('/id/instrument', ReadDataController.getId)

  // app.get('/presets', PresetController.index)
  // app.get('/preset/:id', PresetController.show)
  app.put('/preset/:id', SaveDataController.saveDataToFile)
  // app.post('/preset', PresetController.post)
  // app.get('/presetextended', PresetController.getPresetsExtended)
  app.get('/all/preset', ReadDataController.readDataFromFile)
  app.get('/id/preset', ReadDataController.getId)

  // app.get('/instrumentBanks', InstrumentBankController.index)
  // app.get('/instrumentBank/:id', InstrumentBankController.show)
  app.put('/instrumentBank/:id', SaveDataController.saveDataToFile)
  // app.post('/instrumentBank', InstrumentBankController.post)

  app.get('/all/instrumentBank', ReadDataController.readDataFromFile)
  app.get('/id/instrumentBank', ReadDataController.getId)

  // app.get('/gigs', GigController.index)
  // app.get('/gig/:id', GigController.show)
  app.put('/gig/:id', SaveDataController.saveDataToFile)
  // app.post('/gig', GigController.post)

  app.get('/all/gig', ReadDataController.readDataFromFile)
  app.get('/id/gig', ReadDataController.getId)

  // app.get('/gigsongs', GigController.getGigSongs)
  // app.put('/gigSong/:id', GigController.putGigSong)
  // app.post('/gigSong', GigController.postGigSong)    
  // app.delete('/gigSong/:id', GigController.deleteGigSong)

  // app.get('/currentgig', GigController.currentgig)
}
