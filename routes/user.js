const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js")

// SignUp Form - Route & SignUp - Route

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

// Login Form - Route & Login - Route

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login));

// Logout - Route

router.get("/logout", userController.logout)

module.exports  = router;