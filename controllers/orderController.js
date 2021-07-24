const {Order, CartItem}=require('../models/order')


const createOrder=(req, res)=>{

    req.body.order.user=req.profile
    const order= new Order(req.body.order)
    order.save((error, data)=>{
        if (error) {
            return res.status(400).json('Sorry could not save your order!')
        }
        res.json(data)
    })
}

const listOrders=(req, res)=>{

    Order.find()
        .populate('user', '_id firstName lastName address')
        .sort('-created')
        .exec((err, orders)=>{
            if (err) {
                return res.status(400).json('Sorry could not save your order!')
            }
            res.json(orders)
        })
}
module.exports={
    createOrder,
    listOrders
}