const userControllers=require('../controllers/auth.controller')
const express=require('express')
const router=express.Router();

router.post('/register',userControllers.UserRegister);

router.post('/login',userControllers.Userlogin);


module.exports=router;



