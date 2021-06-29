const express=require('express')
const router=express.Router()


const {userById}=require('../controllers/userController')

router.get('/secret/:userId', (req, res)=>{

    res.json({user:req.profile})
})
router.param('userId', userById)


module.exports=router;