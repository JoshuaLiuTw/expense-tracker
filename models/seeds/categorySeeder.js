const mongoose = require('mongoose')
const Category = require('../category')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
const categoryList = [
  {
    id: 1,
    name: '家居物業'
  },
  {
    id: 2,
    name: '交通出行'
  },
  {
    id: 3,
    name: '休閒娛樂'
  },
  {
    id: 4,
    name: '餐飲食品'
  },
  {
    id: 5,
    name: '其他'
  }
]

db.once('open', () => {
  Promise.all(
    Array.from(
      { length: 5 },
      (_, i) => Category.create({ id: categoryList[i].id, name: categoryList[i].name })
    )
  )
    .then(() => {
      console.log('category done!')
      process.exit()
    })
    .catch((error) => console.log(error))
})