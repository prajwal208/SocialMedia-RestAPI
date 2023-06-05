const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

/*router.get("/register",async(req,res) => {
    const user = await new User({
        username:"prajwal",
        email:"prajwal@gmail.com",
        password:"12345678"
    })

    await user.save()
    res.send("Saved")
})*/


//REGISTER USER
router.post("/register",async(req,res) => {
    

    try{
        //hash password
        const salt = await bcrypt.genSalt(10)      //salt->used to generate random strings
        const hashPassword = await bcrypt.hash(req.body.password,salt)

        //create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword
        })

        //save user in db
        const user = await newUser.save()
        res.status(200).json(user)
    }catch(error){
        res.status(500).send("Error occured")
    }
})


//LOGIN
router.post("/login",async(req,res) => {

    try {
    const user = await User.findOne({email:req.body.email})

    !user && res.status(404).send("User not found")

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    !validPassword && res.status(404).send("Wrong Password")
    
    res.status(200).json(user)
    } catch (error) {
        console.log(error);
    }
    

    
})

module.exports=router
