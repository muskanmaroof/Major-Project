
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}



const express = require("express");
const app =  express();
const mongoose = require("mongoose"); 
// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverrirde = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User  = require("./models/user.js");
const  dbUrl=process.env.ATLASDB_URL;

////// =====  models   ==== /////
const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

/// ==== app.use section ==== ///
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverrirde("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


///connecting function of mongoose with backend
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(dbUrl);
};

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR",err);
})
/////// Session Option //////
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 *60 *1000,
        maxAge :  7 * 24 * 60 *60 *1000,
        httpOnly : true,
    }             
};



// //// Home Route ///
// app.get("/",(req,res)=>{
//     res.send("Hi am root");
// });

//// ==== Session & Flash ==== ///
app.use(session(sessionOptions));
app.use(flash());

/// ==== PASSPORT ==== ///
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/// ==== Flash Function === ///
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

/// ==== Using Routes ==== ///
app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);




// ===== Express Error Handler ==== ///
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
})


/// =====Error Handler ===== ///
app.use((err,req,res,next)=>{
   let {statusCode=500 , message = "something went wrong"} = err;
   res.status(statusCode).render("listings/error.ejs",{message});
//    res.status(statusCode).send(message);
});


app.listen(8080,()=>{
    console.log("app is listening on port on 8080");
});

// app.get("/register",async(req,res)=>{
//     let fakeUser = new User ({
//         email :"abc@gmail.com",
//         username :"abc",
//     });
//     let newUser = await User.register(fakeUser,"pass");
//     res.send(newUser);
// } )

// app.get("/testListing", async (req,res)=>{
//     // let sample = new Listing({
//     //     title:"My new Villa",
//     //     description:"By the Beach",
//     //     price:1500,
//     //     location:"Manoda , Karachi",
//     //     country:"Pakistan",
//     // })
//     // await sample.save();
//     // console.log("sample was saved");
//     res.send("success");
// })