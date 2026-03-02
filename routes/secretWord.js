const express = require("express");
const router = express.Router();
const csrf = require("host-csrf");
const csrfMiddleware = csrf.csrf();
const auth = require("../middleware/auth"); 

router.get("/", auth, (req, res) => {
  const csrfToken = csrf.refreshToken(req, res); 
  if (!req.session.secretWord) req.session.secretWord = "syzygy";


  res.render("secretWord", {
    secretWord: req.session.secretWord,
    csrfToken,           
  });
});

router.post("/", auth, csrfMiddleware, (req, res) => {
  if (req.body.secretWord.toUpperCase()[0] === "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with P.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }

  res.redirect("/secretWord");
});

module.exports = router;