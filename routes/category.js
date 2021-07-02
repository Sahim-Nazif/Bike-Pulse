const express=require('express')
const router=express.Router()
const {create_category, category_ById, read,  get_all_categories, update_category, delete_category
}=require('../controllers/categoryController')
const {isAdmin, isAuth}= require('../controllers/authController')
const {userById}=require('../controllers/userController')

router.post('/category/create/:userId',isAdmin, create_category)
router.get('/category/:categoryId/:userId', read)
router.get('/category/all', get_all_categories)
router.put('/category/update/:categoryId/:userId',isAdmin, update_category)
router.delete('/category/delete/:categoryId/:userId', isAdmin,delete_category)
router.delete('/category/delete/:categoryId/:userId', isAdmin,delete_category)

router.param('categoryId', category_ById)
router.param('userId', userById)
module.exports=router

