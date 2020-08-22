const User =require("../model/user");
const Order =require("../model/order");
const order = require("../model/order");


exports.getUserById =(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err||!user){
            return res.status(400).json({
                error:"No User is Found in DB"
            })
        }
        req.profile =user;
        next()
    })

}

exports.getUser =(req,res)=>{
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile)
}


exports.updateUsers = (req,res)=>{
    User.findByIdAndUpdate(
        { _id:req.profile._id},
        {$set: req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
               return res.status(400).json({
                    error:"You are not authorized to update this user"
                })
            };
            user.salt = undefined;
            user.encry_password = undefined;
            res.json(user)
        }
        );
};

exports.userPurchaseList =(req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_id name")
    .exec((err)=>{
        if(err){
            return res.status(400).json({
                error:"No Order is found"
            })
        }
        return res.json(order);
    })
}

exports.pushOrderInPurchaseList =(req,res,next)=>{
    let purchases =[]
    req.body.order.products.forEach(procduct =>{
        purchases.push({
            _id:procduct._id,
            name:product.name,
            description:procduct.description,
            category:procduct.category,
            quantity:procduct.quantity,
            amount:req.body.order.amount,
            transcation_id:req.body.order.transcation_id
        })
    })
    //store the data in DB
    User.findOneAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new:true},
        (err,purchases)=>{
            if(err){
                return res.status(400).json({
                    error:"Unable to save purchases list"
                })
            }
            next()
        }
       )
    
}