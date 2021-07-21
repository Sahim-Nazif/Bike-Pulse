const express=require('express')
const router=express.Router()
const {isAuth}=require('../controllers/authController')
const {userById}=require('../controllers/userController')
const {createOrder}=require('../controllers/orderController')


router.post('/order/create/:userId', createOrder)

router.param('userId', userById)
module.exports=router
