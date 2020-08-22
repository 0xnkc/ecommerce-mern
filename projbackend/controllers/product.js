const Product =require("../model/product")
const formidable = require("formidable")
const _ =require("lodash")
const fs =require("fs");
const product = require("../model/product");


exports.getProductById =(req,res,next,id) =>{

    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).json({
                error: "Product Not found"
            })
        }
        req.product =product;
        next();

    })

};


exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions=true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error: "Problem with file"
            });
        }

        //destructure the feilds
        const {name,description,price,category,stock}= fields;

        if (!name ||
            !description ||
            !price ||
            !category ||
            !stock) {
                return res.status(400).json({
                    error: "Please include all feilds"
                })
            
        }
        
        let product = new Product(fields)

        //handel file here
        if(file.photo){
            if(file.photo.size>3000000){
                return res.status(400).json({
                    error:"File size is too big"
                })
            }
            product.photo.data =fs.readFileSync(file.photo.path)
            product.photo.contentType =file.photo.type;
        }
        // console.log(product);
        //save to db

        product.save((err,product)=>{
            if(err){
                res.status(400).json({
                    error :"Saving product in Db failed"
                });
            }
            res.json(product)
        });
    });
};

exports.getProduct =(req,res)=>{
    req.product.photo =undefined
    return res.json(req.product)
}
// middelware
exports.photo =(req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};


//delete controller
exports.deleteProduct =(req,res) =>{
let product =req.product;
product.remove((err,deletedProduct)=>{
    if(err){
        return res.status(400).json({
            error :" Failed to Delete the product"
        })
    }
    res.json({
        message:"Product deteled successful",
        deletedProduct
    });
}
)}

//update controller
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with file"
            });
        }

        //Updation code 
        

        let product = req.product;
        product =_.extend(product,fields)

        //handel file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size is too big"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type;
        }
        // console.log(product);
        //save to db

        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Updation of product in Db failed"
                });
            }
            res.json(product)
        });
    });
}

//get all products
exports.getAllProducts =(req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy :"_id";

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy,"asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"No Product Found"
            })
        }
        res.json(products)
    })
}

exports.updateStock =(req,res,next) =>{

    let myOperations =req.body.order.products.map(prod =>{
        return{
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count,sold:+prod.count}}
            }
        }
    })
    product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk Operation Failed"
            })
        }
        next();
    })
}


exports.getAllUniqueCategories =(req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return req.status(400).json({
                error:"No Category Found"
            })
        }
        res.json("category");
    })
}