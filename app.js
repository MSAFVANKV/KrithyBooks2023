const express = require('express');
const path = require('path');
const session = require('express-session');
const detenv = require('dotenv')
const bodyParser = require('body-parser');
const adminRouter = require('./routers/admin')
const userRouter = require('./routers/user');
const flash = require('connect-flash');



const app = express();
detenv.config({path:'.env'})
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs") 
app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({extended:false}))


// session
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true
  }));

  // for flash messages
  app.use(flash());



// static items setting
app.use('/css',express.static(path.resolve(__dirname, "assets/css")));
app.use('/js',express.static(path.resolve(__dirname, "assets/js")));
app.use('/img',express.static(path.resolve(__dirname, "assets/img")));

// page session refresh 23/07/2023
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// app.use((req, res, next) => {
//   console.log(`Received ${req.method} request for ${req.url}`);
//   next();
// });



// routing setting

app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use('/',require('./routers/router'));

const userCollection=require("./models/user")
app.all("*", async (req, res) => {
  const currentUser = await userCollection.findById(req.session.userID);
  res.render("index/404", {
    documentTitle: "404 | Page not found",
    url: req.originalUrl,
    session: req.session.userID,
    currentUser,
  });
});



// PORT setting
app.listen(PORT,() => {(console.log(`Server is running on http://localhost:${PORT}`))});


