import Api from '@/services/Api'

export default {
  async getUsage (instrumentId, midiPc) {
    const result = await Api().get(`presetusage/${instrumentId}/${midiPc}`)
    return result.data
  }
}
