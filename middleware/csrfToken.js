const csrf = require("host-csrf");

const csrfMiddleware = csrf.csrf();

module.exports = (req, res, next) => {
  
  res.locals.csrfToken = csrf.refreshToken(req, res);
  next();
};