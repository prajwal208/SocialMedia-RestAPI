const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

//UPDATE USER
router.put("/:id",async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)
            }catch(err){
                console.log(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body})
            res.status(200).json(user)
        } 
        catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).send("Not Authorized")
    }
})

//DELETE USER
router.delete("/:id",async(req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {
        try {
            await User.findByIdAndDelete(req.params.id)
            return res.status(200).send("Deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
        
    }
    else{
        return res.status(500).json("You are not Authorized")
    }
})


//GET USER
router.get("/:id",async(req,res) => {
    try {
        const user = await User.findById(req.params.id)
        const {password, ...other} = user._doc      //password will not show in the response
        res.status(200).json(other)
    } catch (error) {
        res.status(500).send(error)
    }
})

//FOLLOW USER
router.put("/:id/follow",async(req,res)=> {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{following:req.params.id}})
                res.status(200).send("Following")
            }else{
                res.status(403).send("Already following")
            }
        } catch (error) {
            res.status(500).res.send(error)
        }
    }else{
        res.status(500).send("You cannot follow your account")
    }
})


//UNFOLLOW USER
router.put("/:id/unfollow",async(req,res)=> {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{following:req.params.id}})
                res.status(200).send("User has been Unfollowed")
            }else{
                res.status(403).send("You have already Unfollowed")
            }
        } catch (error) {
            res.status(500).res.send(error)
        }
    }else{
        res.status(500).send("You cannot follow your account")
    }
})


module.exports=router

