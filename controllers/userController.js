const User=require('../models/user')
const {Order} = require('../models/order')

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


const addOrderToUserHistory=(req, res, next)=>{

    let history=[]
    req.body.order.products.forEach((item)=>{
        history.push({
            _id:item._id,
            name:item.name,
            description:item.description,
            category: item.category,
            quantity:item.count,
            transaction_id:req.body.order.transaction_id,
            amount:req.body.order.amount


        })
    })
    User.findOneAndUpdate({_id:req.profile._id}, {$push:{history:history}}, {new:true},
        (error, data)=>{

            if (error) {
                return res.status(400).json({error: 'Could not update user purchase history'})
            }
            next()
    })
}

const purchaseHistory=(req, res)=>{

    Order.find({user:req.profile._id})
         .populate('user', '_id firstName lastName')
         .exec((err, orders)=>{
             if (err) {
                return res.status(400).json({error: 'Could not get user purchase history'})
             }
             res.json(orders)
         })
}
module.exports ={

    userById,
    read,
    update_user,
    addOrderToUserHistory,
    purchaseHistory
}