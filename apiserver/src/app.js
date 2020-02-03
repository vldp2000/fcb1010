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

app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

// const io = require('socket.io')(server);
const io = require('socket.io')(server);
try {
  io.on('connection', function(socket) {
    console.log(`--- socket connected ---client ${socket.id}`)
    // console.log(socket)
    socket.on(`${config.viewProgramMessage}`, function(data) {
      console.log(config.viewProgramMessage)
      console.log(data)
      io.emit(`${config.viewProgramMessage}`, data)
    })

    socket.on(`${config.viewSongMessage}`, function(data) {
      console.log(config.viewSongMessage)
      console.log(data)
      io.emit(`${config.viewSongMessage}`, data)
    })

    socket.on(`${config.controllerProgramMessage}`, function(data) {
      console.log(config.controllerProgramMessage)
      console.log(data)
      io.emit(`${config.controllerProgramMessage}`, data)
    })
    socket.on(`${config.controllerSongMessage}`, function(data) {
      console.log(config.controllerSongMessage)
      console.log(data)
      io.emit(`${config.controllerSongMessage}`, data)
    })
    socket.on(`${config.controllerSyncMessage}`, function(data) {
      console.log(config.controllerSyncMessage)
      console.log(data)
      io.emit(`${config.controllerSyncMessage}`, data)
    })
  })
} catch (ex) {
  console.log(ex)
}

require('./routes')(app)

sequelize.sync({
  force: false,
  logging: console.log
})
  .then(() => {
    app.listen(config.httpPort)
    console.log(`Server started on port ${config.httpPort}`)
  })
