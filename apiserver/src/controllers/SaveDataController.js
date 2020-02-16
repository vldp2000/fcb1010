const config = require('../config/config')
const fs = require('fs')

function getFileName (objName, id) {    
  const result = config.filePath + objName + '/' + id + '.json'
  // console.log(  `Get file name  ==>> ${result}`)
  return result
}


module.exports = {

  async saveDataToFile (req, res) {
 
    // console.log(' ---->>> Save Data <<<<< ')
    // console.log(req.url)
    const objName = req.url.split("/")[1]
    const fileName = getFileName(objName, req.params.id)

    // stringify JSON Object
    var jsonContent = JSON.stringify(req.body)
    
    fs.writeFile(fileName, jsonContent, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.")
        res.status(500).send({
          error: `an error has occured trying to save data ${err}`
        })
      }
    })
    res.status(200).send({
      message: 'OK'
    })
  }
}
