module.exports = (app) => {
  const express = require('express')
  const router = express.Router()
  const { getModelName } = require('../middleware/index')

  // 创建 增
  router.post('/', async (req, res) => {
    const result = await req.model.create(req.body)
    res.send(result)
  })

  // 获取列表 查
  router.get('/', async (req, res) => {
    const result = await req.model.find()
    res.send(result)
  })

  // 删除 删
  router.delete('/:id', async (req, res) => {
    const { id } = req.params
    const result = await req.model.findByIdAndDelete(id)
    res.send(result)
  })

  // 查find by id
  router.get('/:id', async (req, res) => {
    const { id } = req.params
    const result = await req.model.findById(id)
    res.send(result)
  })

  // 改
  router.put('/:id', async (req, res) => {
    const { id } = req.params
    const result = await req.model.findByIdAndUpdate(id, req.body)
    res.send(result)
  })

  app.use('/admin/api/:resource', getModelName, router)

  //upload
  const upload = require('multer')({ dest: __dirname + '../../uploads' })
  app.use('/admin/upload', upload.single('file'), (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })
}
