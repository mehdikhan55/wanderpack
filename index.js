if(process.env.NODE_ENV!="production"){
    require("dotenv").config(); //for environment variables
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const Review = require("./models/review")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session")
const MongoStore= require("connect-mongo");

const flash=require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL="mongodb://127.0.0.1:27017/wonderpack";
const dbUrl=process.env.ATLASDB_URL;

const ExpressError = require("./utils/ExpressError.js")

const ListingsRouter = require("./routes/listing.js");
const ReviewsRouter = require("./routes/review.js");
const userRouter= require("./routes/users.js");


main().then(() => console.log('Connected to DB...')).catch(err => console.log('Error:', err));
async function main() {
    await mongoose.connect(`${dbUrl}`)
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
    mongoUrl: `${dbUrl}`,
    crypto:{
        secret: `${process.env.SECRET}`,
        touchAfter: 24 * 3600, //time period in seconds
    }
})

store.on("error",(err)=>{
    console.log("Mongo Session store error...");
})

const sessionOptions = {
    store,
    secret: `${process.env.SECRET}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}



app.use(session(sessionOptions));
app.use(flash())

//Configuring Strategy (passport)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware
app.use((req, res, next) => {
    console.log(req.method, req.hostname, req.path);
    next();
})

// configuring local variables for flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user;
    next();
})

//testing passport with demo user
// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"abcstudent"
//     });

//     let registeredUser= await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", ListingsRouter);
app.use("/listings/:id/reviews", ReviewsRouter);
app.use("/",userRouter);



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})
  

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render('error.ejs', { err });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});










// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My Home",
//         description:"This is a test listing",
//         price:1000,
//         location:"Test Location",
//         country:"Test Country"
//     });
//     await sampleListing.save().then((result)=>{
//         console.log(result);
//         res.send("successfully added listing");
//     }
//     ).catch((err)=>{
//         res.send(err);
//     });
// })