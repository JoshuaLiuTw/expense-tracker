const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
// 載入設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
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

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  next()
})


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.use(session({
  secret: 'ThisisMySecret',
  resave: false,
  saveUninitialized: true
}))






app.listen(port, () => {
  console.log('Express  is listening on localhost:${port}')
})

