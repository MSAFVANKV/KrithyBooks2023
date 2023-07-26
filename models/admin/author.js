const mongoose=require("mongoose");



const  authorSchema= new mongoose.Schema({
    name: {
        type: String,
        require,
        unique: true,
      },
})

const authorsDetails=mongoose.model("Authors",authorSchema)

module.exports=authorsDetails