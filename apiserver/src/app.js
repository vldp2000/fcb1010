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

const io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log(socket.id)
  socket.on(config.programMessage, function(data) {
    console.log(config.programMessage)
    console.log(data)
    io.emit(config.programMessage, data)
  })
  socket.on(config.songMessage, function(data) {
    console.log(config.songMessage)
    console.log(data)
    io.emit(config.songMessage, data)
  })
  socket.on(config.syncMessage, function(data) {
    console.log(config.syncMessage)
    console.log(data)
    io.emit(config.syncMessage, data)
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
