const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
          user:{
                    type:mongoose.Schema.Types.ObjectId,
                    required:true,
                    ref:"User"
          },
          title:{
                    type:String
          },
          categories:{
             type:String       
          },
          subcategories:{
                    type:String
          },
          image:{
                    type:String,
                    // required:true
          },
          video:{
                    type:String,
          },
          like:{
                    type:Array,
          },
          dislike:{
                    type:Array,
          },
          ProductLinks:{
                    type:Array
          },
          PostedAt:{
            type:Date
        },
          comments:[
                    {
                              user:{
                                        type:mongoose.Schema.ObjectId,
                                        required:true
                              },
                              username:{
                                        type:String,
                                        required:true
                              },
                              profile:{
                                        type:String
                              },
                              comment:{
                                        type:String,
                                        required:true
                              }
                    }
          ]
}
, {timestamps:true})

module.exports = mongoose.model("Post" , PostSchema);