const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../user')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
const SEED_USER = [
  {
    name: "user1",
    email: "user1@example.com",
    password: "1234567",
  },
];

db.once("open", (req, res) => {
  Promise.all(
    Array.from(SEED_USER).map((seed) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(seed.password, salt))
        .then((hash) => {
          return User.create({
            name: seed.name,
            email: seed.email,
            password: hash,
          });
        });
    })
  )
    .then(() => {
      console.log("user done!");
      process.exit();
    })
    .catch((err) => console.log(err));
});