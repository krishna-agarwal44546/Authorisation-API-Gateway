const mongoose=require('mongoose')

const userschema=new mongoose.Schema({
    name : String,
    email: {
        type:String,
        unique:true
    },
    password :String,

})

const usermodel=mongoose.model("User",userschema)

module.exports=usermodel