const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        shippingInfo:{
            address:{
                type:String,
                required:true
            },
            address_2:{
                type:String,
                default:'none'
            },
            city:{
                type:String,
                required:true
            },
            country:{
                type:String,
                required:true
            },
            phone_Number:{
                type:Number,
                required:true
            },
        },
        orderItems:[
            {
            title:{
                type:String,
                required:true
            },
            price:{
                type:Number,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            },
            imgKey:{
                type:[],
                required:true
            },
            _id:{
                type:mongoose.Schema.ObjectId,
                ref:"Product",
                required:true,
            },
            categories:{
                type:String,
                required:true
            },
            subcategories:{
                type:String,
                required:true
            },
            color:{
                type:[],
            },
            size:{
                type:String,
                // required:true
            },
            seller:{
                type:mongoose.Schema.ObjectId,
                ref:"Seller",
                required:true,
            },
            affid:{
                type:mongoose.Schema.ObjectId,
                ref:"User"
            }
        }
    ],
        user: {
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        username:{
            type:mongoose.Schema.Types.String,
            ref:"User",
            require:true
        },
        shipping_price:{
            type:Number,
            default: 0,
            required:true
        },
        Total_amount:{
            type:Number,
            default:0,
            required:true
        },
        orderStatus:{
            type : String,
            required : true,
            default : "Processing"
        },
        PaymentMethods:{
            type:String,
            required:true
        },
        return_order_reason:{
            type:String
        },
        deliveredAt:Date,
        returnAt:Date,
    }, {timestamps:true}
);

module.exports = mongoose.model("Order" , OrderSchema)