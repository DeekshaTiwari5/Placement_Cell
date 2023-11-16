const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const MongoStore = require("connect-mongo");
const middleware = require("./config/middleware");
const passportLocal = require("./config/passport");
const db = require("./config/mongoose");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('assets'));
app.set('layout extractStyles', true);
app.set('layout extractScript', true);
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "placement-cell",
    secret: "blahhhh!",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://deeksha:deeksha@placementcell.bzid2eh.mongodb.net/?retryWrites=true&w=majority",
      autoRemove: "disabled",
    }),
    function(err) {
      console.log(err || "connect-mongodb setup ok");
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(passport.setAuthenticatedUser);
app.use(routes);
app.use(bodyParser.json());

app.listen(port, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
  console.log("server is successfully running on port 8000");
});
