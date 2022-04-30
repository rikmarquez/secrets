//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const _ = require("lodash");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

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
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    if (!err) {
      const user = new User({
        email: req.body.username,
        password: hash
      });
      user.save(function(err){
        if (!err) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    } else {
      console.log(err);
    }
  });
});


app.post("/login", function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({email: username}, function(err, findUser){
    if (err) {
      console.log(err);
    } else {
      if (findUser) {
        bcrypt.compare(password, findUser.password, function(err, result) {
          if (result) {
            res.render("secrets")
          } else {
            console.log("Password Erroneo");
          }
        });
      } else {
        console.log("Usuario no encontrado");
      }
    }
  });
});

//Arrancar Servidor

app.listen(3000, function() {
  console.log("Server started successfuly - PORT 3000");
});
