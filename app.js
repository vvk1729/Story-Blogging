// const express = require("express");
// const mongoose = require("mongoose");
// const passport = require("passport");
// const flash = require("connect-flash");
// const session = require("express-session");
// const morgan = require("morgan");
// const path = require("path");
// const dbURI = require("./config/key");

// const app = express();

// // Passport Config
// require("./config/passport")(passport);

// // Set EJS as view engine
// app.set("view engine", "ejs");

// // Middleware setup
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));
// app.use("/static", express.static(path.join(__dirname, "public")));
// app.use(express.json());
// app.use(morgan("dev"));

// // Express Session
// app.use(session({
//     secret: 'it is project secret.',
//     resave: true,
//     saveUninitialized: true,
//     cookie: { expires: 600000 },
// }));

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// // Connect flash for flash messages
// app.use(flash());

// // Global variables for flash messages
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });

// // Routes
// app.use("/", require("./routes/user.js"));
// app.use("/home", require("./routes/secondHome_routes"));

// // Mongoose Configuration
// mongoose.set('strictQuery', true);
// mongoose.set('debug', true); // Optional: shows DB queries in terminal

// // Connect to MongoDB and start server
// const startServer = async () => {
//     try {
//         await mongoose.connect(dbURI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             serverSelectionTimeoutMS: 30000 // Optional: increase connection timeout
//         });
//         console.log("MongoDB Connected");

//         app.listen(5002, () => {
//             console.log("Server is Listening on port 5002");
//         });
//     } catch (err) {
//         console.error("MongoDB Connection Error: ", err);
//         process.exit(1); // Exit app if DB connection fails
//     }
// };

// startServer();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const dbURI = require("./config/key");

const app = express();

// Passport Config
require("./config/passport")(passport);

// View Engine
app.set("view engine", "ejs");

// MongoDB Connection (Recommended way)
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Recommended timeout
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
};

connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(morgan("dev"));

// Session Setup
app.use(session({
    secret: 'it is project secret.',
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 600000 }, // Session expires in 10 minutes
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());

// Routes
app.use("/", require("./routes/user.js"));
app.use("/home", require("./routes/secondHome_routes"));

// Server
app.listen(5002, () => {
    console.log("Server is Listening on port 5002");
});
