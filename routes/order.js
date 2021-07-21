const express=require('express')
const router=express.Router()
const {isAuth}=require('../controllers/authController')
const {userById}=require('../controllers/userController')
const {create}=require('../controllers/orderController')


router.post('/order/create/:userId', create)

router.param('userId', userById)
module.exports=router
