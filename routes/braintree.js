const express=require('express')
const router=express.Router()
const {isAuth}=require('../controllers/authController')
const {userById}=require('../controllers/userController')



router.get('/braintree/getToken/:userId', isAuth, generateToken)
router.param('userId', userById)
module.exports=router
