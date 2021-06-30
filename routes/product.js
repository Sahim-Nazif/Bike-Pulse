const express=require('express')
const router=express.Router()
const {create_product, productById, read}= require('../controllers/productController')
const {isAdmin, isAuth}= require('../controllers/authController')
const {userById}=require('../controllers/userController')

router.post('/product/create/:userId',isAdmin, create_product)

router.get('/product/:productId', read)

router.param('productId', productById)

router.param('userId', userById)
module.exports=router
