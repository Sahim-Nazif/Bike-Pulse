const express=require('express')
const router=express.Router()
const {isAuth}=require('../controllers/authController')
const {userById, addOrderToUserHistory}=require('../controllers/userController')
const {createOrder}=require('../controllers/orderController')
const {decreaseQuantity}=require('../controllers/productController')

router.post('/order/create/:userId',addOrderToUserHistory, decreaseQuantity, createOrder)

router.param('userId', userById)
module.exports=router
