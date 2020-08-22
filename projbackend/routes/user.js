const express =require("express");
const router =express.Router();

const {
    getUserById,
    getUser,
    updateUsers,userPurchaseList
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { update } = require("../model/user");

router.param("userId",getUserById);
router.get("/user/:userId",isSignedIn,isAuthenticated,getUser);
router.put("/user/:userId",isSignedIn,isAuthenticated,updateUsers);
router.get("/orders/user/:userId",isSignedIn,isAuthenticated,userPurchaseList);


module.exports =router;
