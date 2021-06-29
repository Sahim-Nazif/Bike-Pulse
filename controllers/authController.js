const User=require('../models/user')
const jwt=require('jsonwebtoken')//to generate signed token
const expressJwt=require('express-jwt') //for authorization check


const signup=async(req, res)=>{

   const {firstName, lastName, email,hash_password}= req.body
   const existingUser= await User.findOne({email})
  if (existingUser) {
     
        return res.status(400).json({error:'User or Email Aleay Exist !'})
   }   
   else {
       const user= new User (req.body)

       user.save((err, user)=>{

            if (err) {
                return res.status(400).json({err:error})
            }
            user.salt=undefined
            user.hash_password=undefined

            res.json({user})
       })
   }
}

const signin=async(req, res)=>{

    const {email, password}=req.body
    await User.findOne({email}, (err, user)=>{

        if (err || !user) {
            return res.status(400).json({error:'This User is Not Registered. Would You Like to Sign up Instead?'})
        }
        else if (!user.authenticate(password)) {
            return res.status(401).json({ error: 'Email and password do not match!' })
         }
         //will generate a signed token with user id and secret
         const token=jwt.sign({_id:user._id}, process.env.JWT_SECRET)

         //persist the token as 't' in cookie with expiry date
         res.cookie('t', token, {expire:new Date() + 9999})

         //return response with user and token to frontend client

         const {_id, firstName, lastName, email, role}=user
         return res.json({token, user:{_id, firstName,lastName, email, role}})


    })
}


const signout=(req, res)=>{

    res.clearCookie('t')
    res.json({messge:'Logged out successfully!'})
    
}


const isAuth=(req, res, next)=>{

    let user=req.profile && req.auth && req.profile._id==req.auth._id
    if (!user) {
        return res.status(403).json({error:'Access denied'})


    }
    next()
}

const isAdmin =(req, res, next)=>{

    if (req.profile.isAdmin===0){
        return res.status(403).json({error:'Admin resource ! Access denied'})
    }
    next()
}

module.exports={
    signup, 
    signin,
    signout,
    isAuth,
    isAdmin
 
}