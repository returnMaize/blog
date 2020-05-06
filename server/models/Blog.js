const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  category: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
  title: String,
  content: String,
  comment: String,
  views: Number,
  star: Number,
})

module.exports = mongoose.model('Blog', schema)
