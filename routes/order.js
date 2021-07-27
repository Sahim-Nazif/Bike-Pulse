const express=require('express')
const router=express.Router()
const {isAuth, isAdmin}=require('../controllers/authController')
const {userById, addOrderToUserHistory}=require('../controllers/userController')
const {createOrder, listOrders,getStatusValues}=require('../controllers/orderController')
const {decreaseQuantity}=require('../controllers/productController')

router.post('/order/create/:userId',addOrderToUserHistory, decreaseQuantity, createOrder)
router.get('/order/list/:userId', isAdmin,listOrders )
router.get('/order/status-values/:userId', isAdmin, getStatusValues)

router.param('userId', userById)
module.exports=router
