const mongoose=require("mongoose");



const  authorSchema= new mongoose.Schema({
    name: {
        type: String,
        require,
        unique: true,
      },
      authorImg: {
        type: String,
        required: true,
      },
      aboutAuthor:{
        type: String,
        required: true,
      }
})

const authorsDetails=mongoose.model("Authors",authorSchema)

module.exports=authorsDetails