const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const InfluencerResetTokenSchma = new mongoose.Schema({
          influencer:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Influencer',
                    required:true
          },
          token:{
                    type:String,
                    required:true,
          },
          createdAt:{
                    type:Date,
                    expires:3600,
                    default:Date.now()
          }
});
InfluencerResetTokenSchma.pre("save" , async function (next){
          const salt = await bcrypt.genSalt(10); 
          if(this.isModified("token")){
                    const hash = await bcrypt.hash(this.token , salt);
                    this.token = hash;
          }

          next();
});

// ResetTokenSchma.methods.compareToken = async function (token){
         
//           return result;
// };

module.exports = mongoose.model("InfluencerResetTokenToken" , InfluencerResetTokenSchma)