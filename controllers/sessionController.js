const User = require("../models/User");
const parseValidationErrors = require("../utils/parseValidationErrs");
const csrf = require("host-csrf");

// Show registration page
const registerShow = (req, res) => {
  // Generate CSRF token for this session
  const csrfToken = csrf.refreshToken(req, res);
  console.log("New CSRF token:", csrfToken);

  res.render("register", { csrfToken });
};

// Handle registration
const registerDo = async (req, res, next) => {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.redirect("/sessions/register");
  }

  try {
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseValidationErrors(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }

    return res.redirect("/sessions/register");
  }

  req.flash("info", "Registration successful. You can now log in.");
  res.redirect("/sessions/logon");
};

// Logoff user
const logoff = (req, res) => {
  // Clear CSRF token on logoff
  csrf.clearToken(req, res);

  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

// Show logon page
const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }

  // Generate CSRF token for login page
  const csrfToken = csrf.refreshToken(req, res);
  console.log("New CSRF token for logon:", csrfToken);

  res.render("logon", { csrfToken });
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};
