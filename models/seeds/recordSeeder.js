if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const bcrypt = require("bcryptjs");
const db = require("../../config/mongoose");
const Record = require("../record");
const User = require("../user");

const SEED_USER = [
  {
    name: "user1",
    email: "user1@example.com",
    password: "12345678",
    recordIndex: [0, 2, 4],
  },
  {
    name: "user2",
    email: "user2@example.com",
    password: "12345678",
    recordIndex: [1, 3],
  },
];
const SEED_RECORD = [
  {
    name: "早餐",
    date: "2022-12-10",
    categoryId: 4,
    amount: 60,
  },
  {
    name: "午餐",
    date: "2022-12-11",
    categoryId: 4,
    amount: 900,
  },
  {
    name: "公車",
    date: "2022-12-12",
    categoryId: 2,
    amount: 150,
  },
  {
    name: "喝酒",
    date: "2022-12-13",
    categoryId: 3,
    amount: 800,
  },
  {
    name: "電腦",
    date: "2022-12-2",
    categoryId: 1,
    amount: 35000,
  },
];

db.once("open", () => {
  return Promise.all(
    SEED_USER.map((user) => {
      const { name, email, password, recordIndex } = user;
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      }).then((user) => {
        const userId = user._id;
        const records = recordIndex.map((index) => {
          return { ...SEED_RECORD[index], userId };
        });
        return Record.create(records);
      });
    })
  )
    .then(() => {
      console.log("Record seeder is done!");
      process.exit();
    })
    .catch((err) => console.log(err));
});