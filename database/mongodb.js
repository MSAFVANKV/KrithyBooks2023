// const mongoose = require('mongoose')

// mongoose.connect("mongodb://127.0.0.1:27017/Krithybooks",{
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
    console.log("mongodb Connected");
})
.catch(()=>{
    console.log("connection failed !!");
})