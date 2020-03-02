const path = require('path')

module.exports = {
  httpPort: process.env.PORT || 8081,
  messagePort: 8081,
  filePath: './data/',
  
  viewProgramMessage: 'VIEW_PROGRAM_MESSAGE',
  viewSongMessage: 'VIEW_SONG_MESSAGE',
  controllerProgramMessage: 'CONTROLLER_PROGRAM_MESSAGE',
  controllerSongMessage: 'CONTROLLER_SONG_MESSAGE',
  controllerSyncMessage: 'CONTROLLER_SYNC_MESSAGE',
  controllerGigMessage:'CONTROLLER_GIG_MESSAGE'
}
