const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  url: String,
  imgUrl: String,
  singer: String,
})

module.exports = mongoose.model('Music', schema)
