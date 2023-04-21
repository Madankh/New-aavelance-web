const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const InfluencerVerificationTokenSchma = new mongoose.Schema({
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
InfluencerVerificationTokenSchma.pre("save" , async function (next){
          const salt = await bcrypt.genSalt(10); 
          if(this.isModified("token")){
                    const hash = await bcrypt.hash(this.token , salt);
                    this.token = hash;
          }
          next();
});



module.exports = mongoose.model("InfluencerverificationTokenOTP" , InfluencerVerificationTokenSchma)