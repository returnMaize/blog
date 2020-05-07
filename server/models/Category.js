const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  parent: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Category',
  },
  name: String,
})

module.exports = mongoose.model('Category', schema)
