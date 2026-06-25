import Api from '@/services/Api'

export default {

  async getAllData () {
    let result = await Api().get('all/instrumentbank')
    return result.data
  },
  async getId () {
    let result = await Api().get('id/instrumentbank')
    return result.data.id
  },
  async put (instrumentBank) {
    await Api().put(`instrumentbank/${instrumentBank.id}`, instrumentBank)
  }
}
