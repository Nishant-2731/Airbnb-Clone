const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
// This is used for overriding methods and applying our own method to a form
const methodOverride = require("method-override");
// This method is used to pass header, footer, boilerplate common code templates for use in multiple files
const ejsMate = require("ejs-mate");
// This is used for error handling
const ExpressError = require("./utils/ExpressError.js");
// This is used to store information like cookies, sessionId, req.locals so that we dont have import every time we open the site
const session = require("express-session");
// This is used for flashing one time use messages which dissapear after showing up once
const flash = require("connect-flash");
// This is used for authentication and authorization for login, signup and permissions
const passport = require("passport");
// This means that the username and password will be stored locally
const LocalStrategy = require("passport-local");
// This is used to import User model
const User = require("./models/User.js");

// Listing Route
const listingsRouter = require("./routes/listing.js");
// Review Route
const reviewsRouter = require("./routes/review.js");
// User Route
const usersRouter = require("./routes/User.js")

// This is used to set path for views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

// This is used to set path for public
app.use(express.static(path.join(__dirname, "public/")));

app.engine("ejs", ejsMate);

main()
.then(()=>
{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() 
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");    
};

app.get("/", (req, res)=>
{
    res.send("Root Route")
});

// This is used to give custom options for session
const sessionOptions = {
    secret: "express-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        // This is used ensure session info dissappears after a week. It is in ms (1000ms = 1s)
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

// This is used to initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This middleware is used to store flash messages in req.locals for easier access across different pages
app.use((req, res, next)=>
{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews", reviewsRouter);

app.use("/", usersRouter)

// Error Handler

// Page not found error

app.all("*", (req, res, next)=>
{
    next(new ExpressError(404, "Page Not Found!"));
});

// Default Error

app.use((err, req, res, next)=>
{
    let {statusCode=500, message="Some unexpected error occurred"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, ()=>console.log("Server is Listening on Port: 8080"));