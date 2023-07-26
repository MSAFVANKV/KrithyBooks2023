const express = require('express');
const path = require('path');
const session = require('express-session');
const detenv = require('dotenv')
const bodyParser = require('body-parser');
const adminRouter = require('./routers/admin')



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

// app.use((req, res, next) => {
//   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
//   next();
// });


// static items setting
app.use('/css',express.static(path.resolve(__dirname, "assets/css")));
app.use('/js',express.static(path.resolve(__dirname, "assets/js")));
app.use('/img',express.static(path.resolve(__dirname, "assets/img")));

// page session refresh 23/07/2023
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});


// routing setting
app.use('/',require('./routers/router'))
app.use("/admin", adminRouter)


// PORT setting
app.listen(PORT,() => {(console.log(`Server is running on http://localhost:${PORT}`))});


