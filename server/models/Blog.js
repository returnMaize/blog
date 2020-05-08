const mongoose = require('mongoose')
const Category = require('./Category')

const schema = new mongoose.Schema({
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
  title: String,
  introduction: String,
  content: String,
  imgUrl: String,
})

module.exports = mongoose.model('Blog', schema)
