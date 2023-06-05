const router = require('express').Router()
const Post = require('../models/Post')



//CREATE POST
router.post('/',async (req,res) => {
    const post = new Post(req.body)
    try {
        const savePost = await post.save()
        res.status(200).json(savePost)
    } catch (error) {
        res.status(500).send(error)
    }
})

//UPDATE POST
router.put("/:id",async(req,res) => {
    const post = await Post.findById(req.params.id)
    try {
        if(post.userId === req.body.userId){
            await Post.updateOne({$set:req.body})
            res.status(200).send("Updated Successful")
        }
    } catch (error) {
        res.json(500).send("You cannot update Post")
    }
})


//DELETE POST
router.delete("/:id",async(req,res) => {
    const post = await Post.findById(req.params.id)
    try {
        if(post.userId === req.body.userId){
            await Post.deleteOne()
            res.status(200).send("Deleted Successfully...")
        }
    } catch (error) {
        res.json(500).send("You cannot delete Post")
    }
})

//LIKE POST
router.put("/:id/likes",async(req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await Post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).send("liked the Post")
        }else{
            await Post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).send("Unliked the Post")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


//GET POST
router.get("/:id",async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).send(error)
    }
    
})

module.exports = router