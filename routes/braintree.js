const express=require('express')
const router=express.Router()
const {isAuth}=require('../controllers/authController')
const {userById}=require('../controllers/userController')
const {generateToken,   proccesPayment}=require('../controllers/brainTreeController')


router.get('/braintree/getToken/:userId', generateToken)
router.post('/braintree/payment/:userId', proccesPayment)

router.param('userId', userById)
module.exports=router
