const User=require('../models/user')


const userById=(req, res, next, id)=>{

    User.findById(id).exec((err, user)=>{
        if (err || !user) {

            return res.status(400).json({error:'User not found'})
        }
        req.profile=user

        next()
    })

}

const read=(req, res)=>{

        req.profile.hash_password=undefined
        req.profile.salt=undefined
        return res.json(req.profile)

}

const update_user=(req, res)=> {

    User.findOneAndUpdate({_id:req.profile._id}, {$set:req.body}, {new:true},
        (err, user)=>{
            if (err){
                return res.status(400).json({error:'You are not authorized to perform this action'})
            }
           user.hash_password=undefined
            user.salt=undefined

            res.json(user)
            
        })


}
module.exports ={

    userById,
    read,
    update_user
}