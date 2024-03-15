const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

/// === Get Signup Route ==== /// & /// ==== Post Signup Route ==== ///
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync( userController.signup));

/// === Get Login Route ==== /// & /// === Post Login Route ==== ///
router.route("/login")
.get(userController.renderLoginForm)
.post(
   savedRedirectUrl,
   passport.authenticate("local",{
   failureRedirect:"/login",
   failureFlash:true
}),userController.login);

/// === Get Logout Route ==== ///
router.get("/logout",userController.logout);

module.exports = router;