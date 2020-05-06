const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  avatar: String,
})

module.exports = mongoose.model('Author', schema)
