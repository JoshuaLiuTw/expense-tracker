const express = require('express')
const router = express.Router()

const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .then(records => {
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      return res.render('index', { records, totalAmount })
    })
    .catch(error => console.log(error))
})
router.get('/search', (req, res) => {
  const userId = req.user._id
  const id = req.query.categoryId
  if (id === '6') {
    return res.redirect('/')
  }
  Record.find({ userId })
    .lean()
    .then(records => {
      const findRecord = records.filter(data =>
        data.categoryId === Number(id)
      )
      let totalAmount = 0
      for (let i = 0; i < findRecord.length; i++) {
        totalAmount += findRecord[i].amount
      }
      res.render('index', { records: findRecord, id, totalAmount })
    })
    .catch(error => console.log(error))
})
module.exports = router