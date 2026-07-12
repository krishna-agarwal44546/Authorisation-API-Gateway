const usermodel = require("../models/usermodel");
const sessionmodel=require("../models/session.model")
const otpservice=require('../otpsystem/otpservice')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function UserRegister(req, res) {
    try {
        const { name, email, password } = req.body;

        const user = await usermodel.findOne({ email });

        if (user) {
            return res.status(400).send("User already exists");
        }

        const pass = await bcrypt.hash(password, 10);

        const new_user = new usermodel({
            name,
            email,
            password: pass
        });

        await new_user.save();

        const Refreshtoken=jwt.sign({id:new_user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        const refresh_token_hash=await bcrypt.hash(Refreshtoken,10);

        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

        const otp= otpservice.generateOTP();

        await otpservice.sendOTPEmail(new_user.email,otp);


        const session=new sessionmodel({
            user:new_user._id,
            otp:otp,
            refresh_token:refresh_token_hash,
            ip:req.ip,
            userAgent:req.headers["user-agent"]
        })

        
        await session.save();

        const Accesstoken=jwt.sign({
            id:new_user._id,
            sessionId:session._id
        }
            ,process.env.JWT_SECRET,{
            expiresIn:"15m"
        })

        res.cookie("refresh-token",Refreshtoken,{
            httpOnly:true,
            secure:true,
        })

        return res.status(201).json({
            message: "User registered successfully",
        });


    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err.message
        });
    }
}

async function Userlogin(req,res){
    const {email,password}=req.body;
    const user=await usermodel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"user not found"
        })
    }
        const hashed_password=user.password;
        const result=await bcrypt.compare(password,hashed_password);


        if(result){

        const Refreshtoken=jwt.sign({id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d"
        })

        const refresh_token_hash=await bcrypt.hash(Refreshtoken,10);

        const session=new sessionmodel({
            user:user._id,
            refresh_token:refresh_token_hash,
            ip:req.ip,
            userAgent:req.headers["user-agent"]
        })

        const Accesstoken=jwt.sign({
            id:user._id,
            sessionId:session._id
        }
            ,process.env.JWT_SECRET,{
            expiresIn:"15m"
        })

        res.cookie("refresh-token",Refreshtoken,{
            httponly:true,
            secure:true,
        })
            return res.status(201).json({
                message:"user logged in succesfully"
            })
        }

    }


const controllers={UserRegister,Userlogin};
module.exports = controllers;