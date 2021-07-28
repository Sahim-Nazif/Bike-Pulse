const {Order, CartItem}=require('../models/order')


const createOrder=(req, res)=>{

    req.body.order.user=req.profile
    const order= new Order(req.body.order)
    order.save((error, data)=>{
        if (error) {
            return res.status(400).json({error:'Sorry could not save your order!'})
        }
        res.json(data)
    })
}

const listOrders=(req, res)=>{

    Order.find()
        .populate('user', '_id firstName lastName address')
        .sort('-created')
        .exec((error, orders)=>{
            if (error) {
                return res.status(400).json({error:'Sorry could not save your order!'})
            }
            res.json(orders)
        })
}


const getStatusValues=(req, res)=>{

    res.json(Order.schema.path('status').enumValues)

}


const orderById=(req, res, next, id)=>{

    Order.findById(id)
        .populate('product', 'name price')
        .exec((error, order)=>{
            if (error ||! order) {

                return res.status(400).json({error:'Sorry did not receive the order!'})
            }
            req.order=order
            next()
        })
}

const updateOrderStatus=(req, res)=>{

    Order.updateOne({_id:req.body.orderId},
                 {$set: {status:req.body.status}},
                 (error, order)=>{
        if (error) {

            return res.status(400).json({error:'Sorry order status was not updated!'})
        }
        res.json(order)
    })
}
module.exports={
    createOrder,
    listOrders,
    getStatusValues,
    orderById,
    updateOrderStatus
}