const express=require('express')
const router=express.Router()
const {isAuth}=require('../controllers/authController')
const {userById}=require('../controllers/userController')
const {generateToken,processPayment}=require('../controllers/brainTreeController')


router.get('/braintree/getToken/:userId', generateToken)
router.get('/braintree/payment/:userId', processPayment)

router.param('userId', userById)
module.exports=router
