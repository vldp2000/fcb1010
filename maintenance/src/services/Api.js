import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: `http://192.168.17.20:8081/`
  })
}
