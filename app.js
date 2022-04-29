//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");
const mongoose = require("mongoose");
const md5 = require('md5');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = new mongoose.model("User", userSchema);

// Routing
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  user.save(function(err){
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});


app.post("/login", function(req, res){
  var username = req.body.username;
  var password = md5(req.body.password);

  User.findOne({email: username}, function(err, findUser){
    if (err) {
      console.log(err);
    } else {
      if (findUser) {
        if (findUser.password===password) {
          res.render("secrets");
        } else {
          console.log("Password Incorrecto");
        }
      } else {
        console.log("Usuario no encontrado");
      }
    }
  })
});

//Arrancar Servidor

app.listen(3000, function() {
  console.log("Server started successfuly - PORT 3000");
});
