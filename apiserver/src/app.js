const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
// const morgan = require('morgan')
// const {sequelize} = require('./models')
const config = require('./config/config')
const app = express()
const server = app.listen(config.httpPort, function() {
  console.log(`listening on *:${config.httpPort}`);
});

// app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// const io = require('socket.io')(server);
const io = require('socket.io')(server);
try {
  io.on('connection', function(socket) {
    console.log(`--- message socket connected. client ${socket.id}`)
    // this.$log.debug(socket)
    socket.on(`${config.viewProgramMessage}`, function(data) {
      // this.$log.debug(config.viewProgramMessage)
      // this.$log.debug(data)
      io.emit(`${config.viewProgramMessage}`, data)
    })

    socket.on(`${config.viewSongMessage}`, function(data) {
      // this.$log.debug(config.viewSongMessage)
      // this.$log.debug(data)
      io.emit(`${config.viewSongMessage}`, data)
    })

    socket.on(`${config.controllerProgramMessage}`, function(data) {
      // this.$log.debug(config.controllerProgramMessage)
      // this.$log.debug(data)
      // console.log(data)
      io.emit(`${config.controllerProgramMessage}`, data)
    })
    socket.on(`${config.controllerSongMessage}`, function(data) {
      // this.$log.debug(config.controllerSongMessage)
      // this.$log.debug(data)
      // console.log(data)
      io.emit(`${config.controllerSongMessage}`, data)
    })
    socket.on(`${config.controllerSyncMessage}`, function(data) {
      // this.$log.debug(config.controllerSyncMessage)
      // this.$log.debug(data)
      // console.log(data)
      io.emit(`${config.controllerSyncMessage}`, data)
    })
  })
} catch (ex) {
  console.log(ex)
}

require('./routes')(app)
