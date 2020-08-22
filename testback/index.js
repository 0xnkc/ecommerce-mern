const express = require("express")
const app = express()
const admin =(req,res) =>{
  return res.send("This is admin page ")
}
const isLoggedin =(req,res,next)=>{
  console.log("is Loggedin running")
  next()
}
const isAdmin =(req,res,next)=>{
  console.log("IsAdmin is runnig ")
  next()
}
app.get('/',(req, res) => res.send("Hello World"))
app.get('/login',(req ,res) =>{
    return res.send("login Succesfull")
})
app.get("/Start", (req, res) => {
  return res.send("Start Succesfull");
});

app.get("/admin" ,isLoggedin,isAdmin,admin)
app.listen(8081, () =>{
    console.log("Server is running on post 8081");
});
