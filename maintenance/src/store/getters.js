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
  currentGigId: state => state.currentGigId,
  currentSongId: state => state.currentSongId,
  currentProgramMidiPedal: state => state.currentProgramMidiPedal,
  allInitialized: state => state.allInitialized,
  instrumentListImagesInitialized: state => state.instrumentList[0].imageURL.length > 0,
  refreshSong: state => state.refreshSong,
  defaultPreset: state => state.defaultPreset
}
export default getters
