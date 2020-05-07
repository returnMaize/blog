const mongoose = require('mongoose')
const Category = require('./Category')

const schema = new mongoose.Schema({
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
  title: String,
  content: String,
})

module.exports = mongoose.model('Blog', schema)
