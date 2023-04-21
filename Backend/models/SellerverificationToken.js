const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SellerverificationTokenSchma = new mongoose.Schema({
          seller:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Seller',
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
SellerverificationTokenSchma.pre("save" , async function (next){
          const salt = await bcrypt.genSalt(10); 
          if(this.isModified("token")){
                    const hash = await bcrypt.hash(this.token , salt);
                    this.token = hash;
          }

          next();
});



module.exports = mongoose.model("SellerverificationTokenOTP" , SellerverificationTokenSchma)