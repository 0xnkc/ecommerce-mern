const {Order,ProducCart} =require("../model/order")

exports.createOrder =(req,res)=>{
    req.body.order.user =req.profile
    const order =new Order(req.body.order)
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to save your order in db"
            })
        }
        res.json(order);
    })
}
exports.getOrderById =(req,res,next,id)=>{
    Order.findById(id)
    .populate("products.product","name,price")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No Order Found in DB"
            })
        }
        req.order=order;
        next();
    })
}

exports.getAllOrders =(req,res)=>{
    Order.find()
    .populate("user","_id  name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                error:"No Orders Found in Db"
            })
        }
        res.json(order)
    })
}