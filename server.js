const app=require('./src/app')
const express=require('express')
const morgan=require('morgan')
const connects=require('./db/db')
require('dotenv').config()

app.use(express.json())
app.use(morgan('dev'))
connects.connectDB()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})