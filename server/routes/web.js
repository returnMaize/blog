module.exports = (app) => {
  const express = require('express')
  const router = express.Router()
  const { getModelName } = require('../middleware/index')

  router.get('/', async (req, res) => {
    const result = await req.model.find()
    res.send(result)
  })

  app.use('/web/api/:resource', getModelName, router)
}
