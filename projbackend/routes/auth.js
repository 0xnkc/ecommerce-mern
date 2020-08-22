var express = require('express');
var router = express.Router();
const {signOut,signup,signin, isSignedIn}=require("../controllers/auth");
const { check ,validationResult} = require('express-validator');
const { min } = require('lodash');
router.post("/signup",[
    check("name").isLength({min:3}).withMessage("Name Should be lenth of 3"),
    check("email").isEmail().withMessage("Please Enter the email correctly"),
    check("password").isLength({min:3}).withMessage("Please Enter the password correctly"),


], signup);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Please Enter the email correctly"),
    check("password")
      .isLength({ min: 3 })
      .withMessage("Please Enter the password correctly"),
  ],
  signin
);

router.get("/signout", signOut);
router.get("/testroute",isSignedIn,(req,res)=>{

    res.json(req.auth);

})
module.exports = router;