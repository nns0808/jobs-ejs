const express = require("express");
const router = express.Router();
const passport = require("passport");
const csrf = require("host-csrf");
const User = require("../models/User"); 
const { registerDo, logoff } = require("../controllers/sessionController");

const csrfMiddleware = csrf.csrf();

// Logon

router
  .route("/logon")
  .get((req, res) => {
    const csrfToken = csrf.refreshToken(req, res); 
    res.render("logon", { csrfToken }); 
  })
  .post(
    csrfMiddleware, 
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );

//Register

router
  .route("/register")
  .get((req, res) => {
    const csrfToken = csrf.refreshToken(req, res); 
    res.render("register", { csrfToken }); 
  })
  .post(csrfMiddleware, registerDo); 

// Logoff
router.route("/logoff").post(csrfMiddleware, logoff);

module.exports = router;