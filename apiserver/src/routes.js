const SaveDataController = require('./controllers/SaveDataController')
const ReadDataController = require('./controllers/ReadDataController')

module.exports = (app) => {

  app.put('/song/:id', SaveDataController.saveDataToFile)
  app.get('/song/:id', ReadDataController.readDataByIdFromFile)
  app.get('/all/song', ReadDataController.readDataFromFile)
  app.get('/id/song', ReadDataController.getId)

  app.put('/instrument/:id', SaveDataController.saveDataToFile)
  app.get('/all/instrument', ReadDataController.readDataFromFile)
  app.get('/id/instrument', ReadDataController.getId)

  app.put('/preset/:id', SaveDataController.saveDataToFile)

  app.get('/all/preset', ReadDataController.readDataFromFile)
  app.get('/id/preset', ReadDataController.getId)

  app.put('/instrumentbank/:id', SaveDataController.saveDataToFile)

  app.get('/all/instrumentbank', ReadDataController.readDataFromFile)
  app.get('/id/instrumentbank', ReadDataController.getId)

  app.put('/gig/:id', SaveDataController.saveDataToFile)

  app.get('/all/gig', ReadDataController.readDataFromFile)
  app.get('/id/gig', ReadDataController.getId)
  app.get('/gig/:id', ReadDataController.readDataByIdFromFile)

  app.get('/currentgig', ReadDataController.getScheduledGigId)
  app.put('/currentgig', SaveDataController.saveScheduledGigId)
}
