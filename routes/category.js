const express=require('express')
const router=express.Router()
const {create_category}=require('../controllers/categoryController')
const {isAdmin, isAuth}= require('../controllers/authController')
const {userById}=require('../controllers/userController')

router.post('/category/create/:userId',isAdmin, create_category)


router.param('userId', userById)
module.exports=router

