const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

// Logon
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );

// Register
router.route("/register").get(registerShow).post(registerDo);

// Logoff
router.route("/logoff").post(logoff);

module.exports = router;
