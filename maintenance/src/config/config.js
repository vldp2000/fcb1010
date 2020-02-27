module.exports = {
  API_URL: process.env.VUE_APP_API_URL || 'http://192.168.17.55:8081/',
  messageURL: process.env.VUE_APP_MESSAGE_URL || 'http://192.168.17.55:8088/',
  viewProgramMessage: process.env.VUE_APP_VIEW_PROGRAM_MESSAGE || 'VIEW_PROGRAM_MESSAGE',
  viewSongMessage: process.env.VUE_APP_VIEW_SONG_MESSAGE || 'VIEW_SONG_MESSAGE',
  controllerProgramMessage: process.env.VUE_APP_CONTROLLER_PROGRAM_MESSAGE || 'CONTROLLER_PROGRAM_MESSAGE',
  controllerSongMessage: process.env.VUE_APP_CONTROLLER_SONG_MESSAGE || 'CONTROLLER_SONG_MESSAGE',
  controllerSyncMessage: process.env.VUE_APP_CONTROLLER_SYNC_MESSAGE || 'CONTROLLER_SYNC_MESSAGE',

  aAPI_URL: process.env.VUE_APP_API_URL || 'http://192.168.17.20:8081/',
  amessageURL: process.env.VUE_APP_MESSAGE_URL || 'http://192.168.17.20:8088/'
}
