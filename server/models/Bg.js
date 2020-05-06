const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  imgUrl: String,
})

module.exports = mongoose.model('Bg', schema)
