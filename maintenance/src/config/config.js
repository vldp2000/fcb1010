module.exports = {
  viewProgramMessage: process.env.VUE_APP_VIEW_PROGRAM_MESSAGE || 'VIEW_PROGRAM_MESSAGE',
  viewSongMessage: process.env.VUE_APP_VIEW_SONG_MESSAGE || 'VIEW_SONG_MESSAGE',
  viewPresetVolMessage: process.env.VUE_APP_VIEW_PRESET_VOL_MESSAGE || 'VIEW_PRESET_VOL_MESSAGE',
  viewPresetPanMessage: process.env.VUE_APP_VIEW_PRESET_PAN_MESSAGE || 'VIEW_PRESET_PAN_MESSAGE',

  controllerProgramMessage: process.env.VUE_APP_CONTROLLER_PROGRAM_MESSAGE || 'CONTROLLER_PROGRAM_MESSAGE',
  controllerSongMessage: process.env.VUE_APP_CONTROLLER_SONG_MESSAGE || 'CONTROLLER_SONG_MESSAGE',
  controllerGigMessage: process.env.VUE_APP_CONTROLLER_GIG_MESSAGE || 'CONTROLLER_GIG_MESSAGE',
  controllerSyncMessage: process.env.VUE_APP_CONTROLLER_SYNC_MESSAGE || 'CONTROLLER_SYNC_MESSAGE',
  controllerPedal1Message: process.env.VUE_APP_CONTROLLER_PEDAL1_MESSAGE || 'CONTROLLER_PEDAL1_MESSAGE',
  controllerPedal2Message: process.env.VUE_APP_CONTROLLER_PEDAL2_MESSAGE || 'CONTROLLER_PEDAL2_MESSAGE',
  API_URL: process.env.VUE_APP_API_URL || 'http://vpmidi:8081/',
  messageURL: process.env.VUE_APP_MESSAGE_URL || 'http://vpmidi:8081/'
}
