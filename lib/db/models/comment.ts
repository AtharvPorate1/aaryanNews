import mongoose from 'mongoose'

const CommentSchema = new mongoose.Schema({
    articleId:{
        type:String,
        required:[true, "ArticleId is Mandatory"],
    },
    author:{
        type:String,
        default:"User" 
    },
    content:{
        type:String,
        default:"No Content"
    },
    // createdAt:{
    //     type:String,
    //     default:false
    // },
    upvotes:{
        type:Number, 
        default:0
    },
    downvotes:{
        type:Number, 
        default:0
    },
    uservote:{
        type:String,
    },
    parentId:{
        type:String,
        default:null
    },
    replies:{
        type:[],
        default:[]
    }
},
{
    timestamps:true
})

const Comment = mongoose.models.comment || mongoose.model("comment", CommentSchema)

export default Comment;