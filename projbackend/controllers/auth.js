const User =require("../model/user")
const {check,validationResult} = require('express-validator');
var jwt =require('jsonwebtoken');
var expressJwt =require('express-jwt')

exports.signup =(req,res) =>{
    const errors =validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
    const user = new User(req.body)
    user.save((error,user)=>{
        if(error){
            return res.status(400).json({
                 error: "Not able to save user in DB"
            })
           
        }
        res.json({
            name: user.name,
            email: user.email,
            id:user._id
        });
    })
}

exports.signin = (req,res) =>{
    const errors = validationResult(req);
    const {email,password} =req.body;
    if (!errors.isEmpty()) {
      return res.status(422).json({
        error: errors.array()[0].msg,
      });
    }
    User.findOne((email, (err,user)=>{
        if(err || !user){
           return res.status(400).json({
                error:"User email not exists"
            })
        }

        if(!user.authenticate(password)){
           return res.status(401).json({
                error:"Email and password do not match"
            })

        }
         const token = jwt.sign({_id:user._id},process.env.SECRET)
        //put token in cookie
        res.cookie("token",token,{expaire:new Date()+9999});
        //send response to frontend
        const {_id,name,email,role} = user;
        return res.json({token, user:{_id,name,email,role}});

    }))

}

exports.signOut = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "User Signout successfully" 
    });
}

//protected routes

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})
//custom middelware
exports.isAuthenticated =(req,res,next) =>{
     let checker = req.profile && req.auth && req.profile._id == req.auth._id;
     if(!checker){
        return res.status(403).json({
            error:"Access Denied"
        });
     }
    next();
}


exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error:"You Don't have admin rights , Accsess Denied"
        });
    }
    next();
}