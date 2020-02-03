import io from 'socket.io-client'
const config = require('@/config/config')
const socketClient = io(`${config.messageURL}`)

export default socketClient
