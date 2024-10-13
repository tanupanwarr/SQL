const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sigma_app",
  password: "tanu$20551",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

//Get total no. of users
app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["COUNT(*)"];
      res.render("home.ejs",{count});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occurred");
  }
});

//Show users
app.get("/user", (req,res)=>{
  let q = "SELECT * FROM user";
  try
  {
    connection.query(q, (err, users)=>
    {
      if(err)
        throw err;
      // console.log(users);
      res.render("user.ejs", {users});
    });
  }
  catch(err)
  {
    res.send("Some error occurred");
  }
});

//EDIT Route
app.get("/user/:id/edit",(req,res)=>
{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = "${id}"`;
  // console.log(id);
  try
  {
    connection.query(q, (err, result)=>
    {
      if(err)
        throw err;
      let user = result[0];
      // console.log(result);
      res.render("edit.ejs",{user});
    });
  }
  catch(err)
  {
    res.send("Some error occurred");
  }
})

//Update Route
app.patch("/user/:id", (req, res)=>
{
  let {id} = req.params;
  let { password: formPass, username: newUser } = req.body;
  let q = `SELECT * FROM user WHERE id = ?`;
  
  try
  {
    connection.query(q,[id], (err, result) => {
      if(err)
        throw err;
      let user = result[0];
      if(formPass !== user.password)
      {
        res.send("WRONG password");
      }
      else
      {
        let q2 = `UPDATE user SET username= ? WHERE id= ?`;
        connection.query(q2,[newUser, id], (err, result) => {
          if(err)
            throw err;
          res.send(result);
        });
      }
    });
  }
  catch(err)
  {
    res.send("Some error occurred");
  }
});

app.listen("8080", () => {
  console.log("server is listening to port 8080");
});

// let users = [
//     ["123b", "abc123b", "abc123@gmail.comb", "abc$123b"],
//     ["123c", "abc123c", "abc123@gmail.comc", "abc$123c"]
// ];

// let getRandomUser = () => {
//     return {
//       Id: faker.string.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),

//     };
// };

// let q = "INSERT INTO user(id, username, email, password) VALUES ?";

// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
// }

// connection.end();
