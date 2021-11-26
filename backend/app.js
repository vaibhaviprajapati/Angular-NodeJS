var express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
var cors = require('cors');
const postsRoutes = require("./routes/post");
const userRoutes = require('./routes/user');
const mangoose = require('mongoose');
var app = express();

mangoose.connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false')
.then(()=>{
  console.log('Connect to database')
})
.catch(()=>{
  console.log('Connection Failed!')
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
 app.use(cors());
 app.use('/images', express.static(path.join('backend/images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Authorization,X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});
app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
module.exports = app;

