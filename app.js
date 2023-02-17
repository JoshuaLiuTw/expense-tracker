const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const Record = require('./models/record')
const bodyParser = require('body-parser')
const record = require('./models/record')
const methodOverride = require('method-override')


//載入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  Record.find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const name = req.body.name
  return Record.create({ name })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))

})

app.delete('/records/:id', (req, res) =>{
  const id = req.params.id 
  return Record.findById(id)
  .then(record => record.remove())
  .then(() => res.redirect('/'))
  .catch(error => console.log(error))
})

app.put('/records/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Record.findById(id)
    .then(record => {
      record.name = name
      return record.save()
    })
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})


app.listen(port, () => {
  console.log('Express  is listening on localhost:${port}')
})

