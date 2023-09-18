// const mongoose = require('mongoose')

// mongoose.connect(process.env.MONGODB_URL_LOCAL,{
//      useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(()=>{
//     console.log("mongodb Connected");
// })
// .catch(()=>{
//     console.log("connection failed !!");
// })

const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL,{
     useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("mongodb Connected in atles");
})
.catch(()=>{
    console.log("connection failed !!");
})