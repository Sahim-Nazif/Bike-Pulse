const express=require('express')
const router=express.Router()
const {create_product, productById, read, delete_product, update_product}= require('../controllers/productController')
const {isAdmin, isAuth}= require('../controllers/authController')
const {userById}=require('../controllers/userController')

router.post('/product/create/:userId',isAdmin, create_product)
router.delete('/product/delete/:productId/:userId',isAdmin, delete_product)
router.put('/product/update/:productId/:userId', isAdmin, update_product)
router.get('/product/:productId', read)

router.param('productId', productById)

router.param('userId', userById)
module.exports=router
