import Api from '@/services/Api'

export default {
  index (search) {
    return Api().get('songs', {
      params: {
        search: search
      }
    })
  },
  showById (songId) {
    return Api().get(`databyid/:song/:id/${songId}`)
  },
  showAll () {
    return Api().get('data/song')
  },
  post (song) {
    return Api().post('song', song)
  },
  put (song) {
    return Api().put(`song/${song.id}`, song)
  }
}
