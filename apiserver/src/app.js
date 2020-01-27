const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const {sequelize} = require('./models')
const config = require('./config/config')

const app = express()

const server = app.listen(config.messagePort, function() {
  console.log(`listening on *:${config.messagePort}`);
});
const presetMessage = 'PRESET_MESSAGE'
const songMessage = 'SONG_MESSAGE'

app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

const io = require('socket.io')(server);

io.on('connection', function(socket) {
    console.log(socket.id)
    socket.on(presetMessage, function(data) {
      console.log(presetMessage)
      console.log(data)
      io.emit(presetMessage, data)
    })
    socket.on(songMessage, function(data) {
      console.log(songMessage)
      console.log(data)
      io.emit(songMessage, data)
  })
})

require('./routes')(app)

sequelize.sync({
  force: false,
  logging: console.log
})
  .then(() => {
    app.listen(config.httpPort)
    console.log(`Server started on port ${config.httpPort}`)
  })
