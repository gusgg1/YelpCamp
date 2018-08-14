require('dotenv').config();
const express        = require("express");
const bodyparser     = require("body-parser");
const mongoose       = require("mongoose");
const flash          = require("connect-flash");
const passport       = require("passport");
const LocalStrategy  = require("passport-local");
const Campground     = require("./models/campground");
const app            = express();
const Comment        = require("./models/comment");
const User           = require("./models/user");
const seedDB         = require("./seeds");
const methodOverride = require("method-override");

// requiring routes
const commentRoutes = require("./routes/comments");
const campRoutes    = require("./routes/campgrounds");
const indexRoutes   = require("./routes/index");


mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // see the DB


// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "yelpcamp",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This is added to every single template, every route will have "currentUser" available in the template.equal to the currently logged in user.
app.use(function(req, res, next) {
  res.locals.moment = require("moment");
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});


app.use(indexRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function() {
  console.log("running on port 3000");
});
