const express=require('express')
const router=express.Router()
const {create_product,
        productById,
         read,
          delete_product,
           update_product, 
           list,
            related_products,
            list_categories,
            listBySearch, 
            photo}= require('../controllers/productController')
const {isAdmin, isAuth}= require('../controllers/authController')
const {userById}=require('../controllers/userController')

router.post('/product/create/:userId',isAdmin, create_product)
router.delete('/product/delete/:productId/:userId',isAdmin, delete_product)
router.put('/product/update/:productId/:userId', isAdmin, update_product)
router.get('/product/:productId', read)
router.get('/products', list)
router.get('/products/related/:productId',related_products )
router.get('/products/categories', list_categories)
router.post('/products/by/search', listBySearch)
router.get('/products/photo/:productId', photo)

router.param('productId', productById)

router.param('userId', userById)
module.exports=router
