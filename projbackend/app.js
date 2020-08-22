require("dotenv").config()
const port = process.env.PORT;
const mongoose = require('mongoose')
const express = require("express")
const bodyParser = require('body-parser')
const cookeiParser =require('cookie-parser')
const cors = require('cors')
const app = express()
// My routes
const authRoutes =require("./routes/auth")
const userRoutes =require("./routes/user")
const categoryRoutes =require("./routes/category")
const productRoutes =require("./routes/product")

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>console.log("DB CONNECTED")).catch(()=>console.log("DB Error"))


app.use(bodyParser.json())
app.use(cookeiParser())
app.use(cors())
//My routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)

app.listen(port, () => console.log('app is running on ${port}'))