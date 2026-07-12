const mongoose=require('mongoose')

async function connectDB(){
    await mongoose.connect(process.env.URI);
}

async function connectDB2(){
    await mongoose.connect(process.env.SESSION);
}

module.exports={connectDB,connectDB2}