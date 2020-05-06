module.exports = {
  getModelName,
}

function getModelName(req, res, next) {
  const { resource } = req.params
  const modelName = require('inflection').classify(resource)
  req.model = require(`../models/${modelName}`)
  next()
}
