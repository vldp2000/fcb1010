const config = require('../config/config')
const fs = require('fs')
const { resolve } = require('path')
var promisify = require("promisify-node");
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)



function getFileName (objName, id) {    
  const result = config.filePath + objName + '/' + id + '.json'
  // console.log(  `Get file name  ==>> ${result}`)
  return result.toLowerCase()
}

async function readAllFiles(dir) {
  // console.log('--2---read all files ------')
  // console.log(dir)
  var data = []

  const files = await getSchemaFiles(dir.toLowerCase())
  // console.log(files)
  //listing all files using forEach
  for (let file of files) {
    const jf =  await readFile(file, 'utf8')
    const result = await JSON.parse(jf)
    // console.log(file)
    data.push(result)
  }
  // console.log('--4---read all files ------')
  // console.log(data)
  return data
}

const getSchemaFiles =  async function (folder) {
  try {
    const files = await readdir(resolve(folder)) || []
    const result = files
    .map(file => folder + '/' + file)
    //  .filter(async file => (await stat(file)).isFile())
    .filter(file => file.endsWith('.json'))
    // console.log('--3---read all files ------')
    return result
  } catch (ex) {
    console.log(ex)
  }
  return []
}

async function readFromFile(fileName) {
  // console.log('---3--readFromFile--------------')
  // console.log(fileName)
  const data =  await readFile(fileName.toLowerCase(), 'utf8')
  const result = await JSON.parse(data)
  return result
}

async function getNewId(folder) {
  // console.log('---3--readFromFile--------------')
  // console.log(fileName)
  const fileName = folder+'/id/id.json'
  // console.log(fileName)
  const file = await readFile(fileName.toLowerCase(), 'utf8')
  const data = await JSON.parse(file)

  let result = Object.assign({}, data)
  data.id = data.id + 1
  // console.log(data)
  
  fs.writeFile(fileName, JSON.stringify(data), 'utf8', function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.")
      result.id = -1
    }
  })
  return result
}

module.exports = {

  async readDataFromFile (req, res) {
    const objName = req.url.split("/")[2]
    // console.log(req)
    if (req.params.id) {
      const fileName = getFileName(objName, req.params.id)
      const result = readFromFile(fileName)
      // console.log(result)
      res.send(result)
    } else {
      const dirName = config.filePath + objName
      const result = await readAllFiles(dirName.toLowerCase())
      // console.log('---5 -----------')
      // console.log(result)
      res.send(result)
    }
  },

  async readDataByIdFromFile (req, res) {
    const objName = req.url.split("/")[1]
    // console.log(req.url)
    if (req.params.id) {
      const fileName = getFileName(objName, req.params.id)
      // console.log(fileName)
      const result = await readFromFile(fileName.toLowerCase())
      // console.log(result)
      res.send(result)
    }
  },


  async getId (req, res) {
    const objName = req.url.split("/")[2]
    const folder = config.filePath + objName 
    result = await getNewId(folder.toLowerCase())
    res.send(result)
  },

  async getCurrentGigId (req, res) {
    const fileName = config.filePath + 'gig/id/currentgig.json'
    // console.log(fileName)
    const file = await readFile(fileName.toLowerCase(), 'utf8')
    const result = await JSON.parse(file)
    // console.log(result)
    res.send(result)
  }
}
