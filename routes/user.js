const express=require('express')
const router=express.Router()
const {isAuth, isAdmin}=require('../controllers/authController')

const {userById, read, update_user}=require('../controllers/userController')

router.get('/secret/:userId', isAuth,isAdmin,(req, res)=>{

    res.json({user:req.profile})
})

router.get('/user/:userId', read)
router.put('/user/:userId', update_user)

router.param('userId', userById)



module.exports=router;