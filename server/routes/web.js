module.exports = (app) => {
  const express = require('express')
  const router = express.Router()
  const { getModelName } = require('../middleware/index')

  router.get('/', async (req, res) => {
    let result
    if (req.model.modelName === 'Category') {
      result = await req.model.find({ parent: null })
    } else {
      result = await req.model.find()
    }
    res.send(result)
  })

  router.get('/:id', async (req, res) => {
    let result
    const modelName = req.model.modelName
    const id = req.params.id
    if (modelName === 'Category') {
      result = await req.model.find({ parent: id })
    } else if (modelName === 'Blog') {
      if (id) {
        result = await req.model.find({ category: id })
      } else {
        result = await req.model.find()
      }
    }
    res.send(result)
  })

  app.use('/web/api/:resource', getModelName, router)
}
