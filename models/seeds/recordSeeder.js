const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const Record = require('../record')
const User = require('../user')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI)


db.once("open", () => {

  Promise.all(Array.from(SEED_USER, user => {
    const { name, email, password } = user
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => {
        User.create({ name, email, password: hash })
          .then(user => {
            const userId = user._id
            return Promise.all(Array.from(
              { length: 3 },
              (_, i) =>
                Record.create({
                  userId,
                  name: `Record-${i}`,
                  date: `2023-02-${31 - (i + 3)}`,
                  category: categoryData[i]._id,
                  amount: Math.floor(Math.random() * 3000) + 1
                })
            ))
          })
      })
  })
  )


    .then(() => {
      console.log("user done!");
      process.exit();
    })
    .catch((err) => console.log(err));
});