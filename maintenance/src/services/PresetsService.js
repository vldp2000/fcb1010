import Api from '@/services/Api'

export default {
  async getAllData () {
    let result = await Api().get('all/preset')
    return result.data
  },
  async getId () {
    let result = await Api().get('id/preset')
    return result.data.id
  },
  async put (preset) {
    await Api().put(`preset/${preset.id}`, preset)
  }
}
