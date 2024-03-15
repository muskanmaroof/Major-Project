const User = require("../models/user.js");

/// === Get Signup Route ==== ///
module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

/// === Post Signup Route ==== ///
module.exports.signup = async (req,res)=>{
    try{
       let {username, email ,password} = req.body;
       const newUser = new User({username , email});
       const registeredUser = await User.register(newUser,password);
       console.log(registeredUser);
       req.login(registeredUser,(err)=>{
          if(err){
             return next(err);
          }
          req.flash("success","Welcome to wonderWorld");
          res.redirect("/listings");
       })
      }catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
 };

 /// === Get Login Route ==== ///
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
 };

 /// === Post Login Route ==== ///
module.exports.login =async(req,res)=>{
    req.flash("success","Welcome Back to WonderWorld!");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

/// === Get logout Route ==== ///
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
       if(err){
         return next(err);
       }
       req.flash("success","You are logged out");
       res.redirect("/listings");
    })
};
