require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser(process.env.SESSION_SECRET));

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", (error) => console.log(error));

const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

app.use(session(sessionParms));

// Flash
app.use(require("connect-flash")());

// Passport
const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();

app.use(passport.initialize());
app.use(passport.session());

// store local
app.use(require("./middleware/storeLocals"));

// csrf
const csrfTokenMiddleware = require("./middleware/csrfToken");
app.use(csrfTokenMiddleware);

// auth middleware
const auth = require("./middleware/auth");

// routes
app.get("/", (req, res) => res.render("index"));

app.use("/sessions", require("./routes/sessionRoutes"));

// Secret word 
const secretWordRouter = require("./routes/secretWord");
app.use("/secretWord", auth, secretWordRouter);

// Jobs 
const jobsRouter = require("./routes/jobs");
app.use("/jobs", auth, jobsRouter);

// error handler
app.use((req, res) =>
  res.status(404).send(`That page (${req.url}) was not found.`)
);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();