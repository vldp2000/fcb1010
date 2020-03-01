import Api from '@/services/Api'
import Vue from 'vue'

export default {
  async getAllData () {
    let result = await Api().get('all/preset')
    // console.log(data)
    return result.data
  },
  async getId () {
    let result = await Api().get('id/preset')
    return result.data.id
  },
  async put (preset) {
    Vue.$log.debug('// ----------->>return Api().put(preset{preset.id}, preset)')
    Vue.$log.debug(preset)
    Vue.$log.debug(preset.id)
    let result = await Api().put(`preset/${preset.id}`, preset)
    let newPreset = await result.data
    Vue.$log.debug('// -----------result')
    Vue.$log.debug(newPreset)
  }

  // async getAll () {
  //   let presets = await Api()('presets')
  //   // Vue.$log.debug('// ----------->> get all presets')
  //   // Vue.$log.debug(presets.data)
  //   return presets.data
  // },
  // index (search) {
  //   let presets = Api().get('presets', {
  //     params: {
  //       search: search
  //     }
  //   })
  //   // Vue.$log.debug('// ----------->> get all presets')
  //   // Vue.$log.debug(presets.data)
  //   return presets.data
  // },

  // show (presetId) {
  //   let result = Api().get(`presets/${presetId}`)
  //   return result.data
  // },

  // async post (preset) {
  //   Vue.$log.debug('// ----------->>call Api().post(preset)')
  //   Vue.$log.debug(preset)
  //   let result = await Api().post('preset', preset)
  //   let newPreset = await result.data
  //   Vue.$log.debug('// -----------result')
  //   Vue.$log.debug(newPreset)
  //   // await store.dispatch('addPreset', newPreset)
  // },

}
