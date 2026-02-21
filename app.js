require("dotenv").config();
const express = require("express");
require("express-async-errors");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// ----- Sessions -----
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

// ----- Flash -----
app.use(require("connect-flash")());

// ----- Passport -----
const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();

app.use(passport.initialize());
app.use(passport.session());

// ----- Store locals AFTER Passport -----
app.use(require("./middleware/storeLocals"));

// ----- Routes -----
app.get("/", (req, res) => res.render("index"));

app.use("/sessions", require("./routes/sessionRoutes"));

// Protect and use secretWord routes
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
app.use("/secretWord", auth, secretWordRouter);

// ----- Error handlers -----
app.use((req, res) =>
  res.status(404).send(`That page (${req.url}) was not found.`)
);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message);
});

// ----- Start server -----
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
