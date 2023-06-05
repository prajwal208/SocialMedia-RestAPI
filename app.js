const express = require('express')
const app = express()
const mongoose = require('mongoose')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()
const Userouter = require('./routes/users')
const Authrouter = require('./routes/auth')
const Postrouter = require('./routes/post')

const connectdb = async() => {
try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("connected to db"); 
}
catch(err){
    console.log("Failed to connect",err);
    }
}
connectdb()


//middlewear
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))


app.use("/api/users",Userouter)
app.use("/api/auth/",Authrouter)
app.use("/api/post/",Postrouter)


PORT=5000
app.listen(PORT,() => {
    console.log(`Server started at Port ${PORT}`)
})

