require('dotenv').config();
const express = require('express');
const bodyParser=require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const encrypt = require('mongoose-encryption');




const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));







mongoose.connect('mongodb://127.0.0.1:27017/usersDB',
{             // connecting mongoose with node
 useNewUrlParser: true,

 useUnifiedTopology: true
}, function(err){
 if(err){
   console.log(err);
 }
 else{
   console.log("successfully connected to database.");
 }
}
);





const usersSchema = new mongoose.Schema({
  email: String,
  password: String
});






usersSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']})





// creating model(collection)
const users = mongoose.model('users', usersSchema);





app.get('/', function(req, res){
  res.render('home')
});
app.get('/login', function(req, res){
  res.render('login')
});app.get('/register', function(req, res){
  res.render('register')
});



app.post('/register', function(req, res){
  const username = req.body.username
  const password = req.body.password
  const newUser = new users({
    email : username,
    password : password

  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render('secrets')
    }
  });
});




app.post('/login', function(req, res){
  const username = req.body.username
  const password = req.body.password
  users.findOne({email: username}, function(err , foundUser){
    if(err){
      res.send('Username or password incorrect')
    }else{
      if(foundUser.password === password){
        res.render('secrets')
      }
    }
  });

});











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
