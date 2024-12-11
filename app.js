if(process.env.NODE_ENV != "production")
{
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/User.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public/")));

app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLAS_DB_URL;

main()
.then(()=>
{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() 
{
    await mongoose.connect(dbUrl);    
};

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*60*60 // In seconds
})

store.on("error", ()=>
{
    console.log("Error in Monogo Session Store", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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