module.exports = (app) => {
  const mongoose = require('mongoose')
  mongoose.set('useFindAndModify', false)

  mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
}
