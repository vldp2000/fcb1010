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
    // console.log(`--- message socket connected. client ${socket.id}`)

    socket.on(`${config.viewProgramMessage}`, function(data) {
      // console.log(config.viewProgramMessage)
      // console.log(data)
      io.emit(`${config.viewProgramMessage}`, data)
    })

    socket.on(`${config.viewSongMessage}`, function(data) {
      // console.log(config.viewSongMessage)
      // console.log(data)
      io.emit(`${config.viewSongMessage}`, data)
    })

    socket.on(`${config.viewEditModeMessage}`, function(data) {
      // console.log(config.viewEdtModeMessage)
      io.emit(`${config.viewEditModeMessage}`, data)
    })
    
    
    socket.on(`${config.controllerPresetVoluleMessage}`, function(data) {
      io.emit(`${config.controllerPresetVoluleMessage}`, data)
    })

    socket.on(`${config.controllerProgramMessage}`, function(data) {
      io.emit(`${config.controllerProgramMessage}`, data)
    })

    socket.on(`${config.controllerSongMessage}`, function(data) {
      io.emit(`${config.controllerSongMessage}`, data)
    })
    socket.on(`${config.controllerGigMessage}`, function(data) {
      io.emit(`${config.controllerGigMessage}`, data)
    })
    
    //reserved
    socket.on(`${config.controllerPedal1Message}`, function(data) {
      io.emit(`${config.controllerPedal1Message}`, data)
    })

    //reserved
    socket.on(`${config.controllerPedal2Message}`, function(data) {
      io.emit(`${config.controllerPedal2Message}`, data)
    })
    
    socket.on(`${config.controllerSyncMessage}`, function(data) {
      // console.log(config.controllerSyncMessage)
      // console.log(data)
      io.emit(`${config.controllerSyncMessage}`, data)
    })
  })
} catch (ex) {
  console.log(ex)
}

require('./routes')(app)
