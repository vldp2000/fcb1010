const getters = {
  songList: state => state.songList,
  instrumentList: state => state.instrumentList,
  presetList: state => state.presetList,
  instrumentBankList: state => state.instrumentBankList,
  gigList: state => state.gigList,
  gigSongList: state => state.gigSongList,
  // getPresetById: state => id => state.presetList.find(preset => preset.id === id)
  getPresetById (state) {
    return id => state.presetList.filter(item => {
      return item.id === id
    })
  },
  scheduledGigId: state => state.scheduledGigId,
  selectedGigId: state => state.selectedGigId,
  currentSongId: state => state.currentSongId,
  currentProgramMidiPedal: state => state.currentProgramMidiPedal,
  allInitialized: state => state.allInitialized,
  initialisingIsInProgress: state => state.initialisingIsInProgress,
  instrumentListImagesInitialized: state => state.instrumentList[0].imageURL.length > 0,
  refreshSong: state => state.refreshSong,
  defaultPreset: state => state.defaultPreset,
  pedal1Value: state => state.pedal1Value,
  pedal2Value: state => state.pedal2Value
}
export default getters
