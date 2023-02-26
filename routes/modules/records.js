const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require("../../models/category");

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const { name, date, amount, categoryId } = req.body
  return Record.create({ name, date, amount, userId, categoryId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const categories = [];
  Category.find()
    .lean()
    .sort({ id: "asc" })
    .then((category) => {
      categories.push(...category);
    })
    .then(() => {
      Record.findOne({ _id, userId })
        .lean()
        .then((record) => {
          record.date = record.date.toLocaleDateString("fr-CA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
          res.render("edit", { record, categories });
        });
    })
    .catch((err) => console.log(err));
});

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const { name, date, amount, categoryId } = req.body
  return Record.findByIdAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})



module.exports = router