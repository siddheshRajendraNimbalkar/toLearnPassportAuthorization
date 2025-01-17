var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()))


router.get('/', function(req, res, next) {
  res.render('index')
});


router.get('/login', function(req, res, next) {
  res.render('login')
});

router.get("/profile",isLoggedIn ,(req,res,next)=>{
  res.send("profile")
})

router.post("/register", (req,res)=>{
    const { username, email, fullname} = req.body;
    const userData = new userModel({ username, email, fullname });

    userModel.register(userData, req.body.password)
    .then(()=>{
      passport.authenticate("local")(req,res,()=>{
        res.redirect("/profile");
      })
    })
})

router.post("/login", passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect:"/login"
}),(req,res)=>{
    
});

router.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err){return next(err); }
    res.redirect("/login");
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  else{
    res.redirect("/login");
  }
};

module.exports = router;