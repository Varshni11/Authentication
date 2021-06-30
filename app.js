//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption")

const app=express();

app.use(express.static("public"));

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser:true,useUnifiedTopology: true});

const usersSchema=new mongoose.Schema({
  email:String,
  password:String
});

console.log(process.env.API_KEY);

usersSchema.plugin(encrypt,{ secret:process.env.SECRET, encryptedFields:["password"]});

const User= new mongoose.model("User",usersSchema);



app.get('/',function(req, res){
  res.render("home");
});

app.get('/login',function(req, res){
  res.render("login");
});

app.get('/register',function(req, res){
  res.render("register");
});

app.post("/register",function(req,res){

  const newUser=new User({
    email:req.body.username,
    password: req.body.password
  });

  newUser.save(function (err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });

});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.find({email:username,password:password},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        res.render("secrets");
      }else{
        res.render("register",{error:"You have to register yourself before logging in"});
      }
    }
  });



});



app.get("/logout", function(req, res){
  res.redirect("/");
});





app.listen(3000, function(){
  console.log("Server started on port 3000");
});
