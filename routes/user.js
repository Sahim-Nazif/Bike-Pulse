const express=require('express')
const router=express.Router()
const {isAuth, isAdmin}=require('../controllers/authController')

const {userById}=require('../controllers/userController')

router.get('/secret/:userId', isAuth,isAdmin,(req, res)=>{

    res.json({user:req.profile})
})
router.param('userId', userById)


module.exports=router;