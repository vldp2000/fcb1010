import axios from 'axios'
const config = require('@/config/config')

export default () => {
  return axios.create({
    baseURL: config.baseURL
  })
}
