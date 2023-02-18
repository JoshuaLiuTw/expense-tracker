
const Record = require('../record')
const db = require('../../config/mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}



db.once('open', () => {
  console.log('mongodb connected!')
  for(let i = 0; i < 10; i++){
    Record.create({name: `name-${i}`})
  }
  console.log('done')
})