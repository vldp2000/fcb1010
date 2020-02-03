import Api from '@/services/Api'
// import store from '@/store/store'

export default {
  async getAll () {
    let presets = await Api()('presets')
    // console.log('// ----------->> get all presets')
    console.log(presets.data)
    return presets.data
  },
  index (search) {
    let presets = Api().get('presets', {
      params: {
        search: search
      }
    })
    console.log('// ----------->> get all presets')
    console.log(presets.data)
    return presets.data
  },

  show (presetId) {
    let result = Api().get(`presets/${presetId}`)
    return result.data
  },

  async post (preset) {
    console.log('// ----------->>call Api().post(preset)')
    console.log(preset)
    let result = await Api().post('preset', preset)
    let newPreset = await result.data
    console.log('// -----------result')
    console.log(newPreset)
    // await store.dispatch('addPreset', newPreset)
  },

  async put (preset) {
    console.log('// ----------->>return Api().put(preset{preset.id}, preset)')
    console.log(preset)
    console.log(preset.id)
    let result = await Api().put(`preset/${preset.id}`, preset)
    let newPreset = await result.data
    console.log('// -----------result')
    console.log(newPreset)
    // await store.dispatch('updatePreset', newPreset)
  }
}
