const through = require('through2')
var gm = require('gm').subClass({ imageMagick: true })
var smartcrop = require('smartcrop-gm')
var fs = require('fs')
var Vinyl = require('vinyl')

function applySmartCrop(file, width, height) {
    return new Promise((resolve, reject) => {
        smartcrop.crop(file.contents, { width, height })
        .then(function(result) {
          var crop = result.topCrop
          gm(file.contents)
            .crop(crop.width, crop.height, crop.x, crop.y)
            .resize(width, height)
            .toBuffer('JPG',function (err, buffer) {
                if (err) return reject(err)
                let newFile = new Vinyl({...file, contents: buffer})
                console.log(newFile.relative)
                resolve(newFile)
            })
        }).catch(reject)
    })
    
}


module.exports = function({width, height}) {

    var pushResult = (transformation, file, callback) => {
        transformation.push(file)
        callback()
    }
    
    var transform = function(file, encoding, callback) {
        let transformation = this
        applySmartCrop(file, width, height, transformation)
            .then((newFile) => pushResult(transformation, newFile, callback))
            .catch((err) => callback())
    }
  
    return through.obj(transform)
}
