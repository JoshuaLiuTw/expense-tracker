const express = require('express')
const exphbs = require('express-handlebars')

//載入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}


const app = express()
const port = 3000
const bodyParser = require('body-parser')

const methodOverride = require('method-override')
const routes = require('./routes')
require('./config/mongoose')







app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')



app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)






app.listen(port, () => {
  console.log('Express  is listening on localhost:${port}')
})

