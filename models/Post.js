const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    userId:{
        type:String,
        req:true
    },
    desc:{
        type:String
    },
    image:{
        type:String
    },
    likes:{
        type:Array,
        default:[]
    }
})

module.exports = mongoose.model('Post',PostSchema)