const router = require("express").Router();
const MainAdmin = require('../models/MainAdmin')
const User = require("..//models/User");
const Seller = require("..//models/Seller");
const Influencer = require("..//models/Influencer");
const { body, validationResult } = require('express-validator');
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const Order = require("../models/Order");
const {mainAdminverifyTokenAndAdmin , mainAdminverifyToken} = require('./mainAdminverify');
const BankAccount = require("../models/BankAccount");
const UserBankAccount = require("../models/InfluencerBankAccount")
const PendingSellerMoney = require("../models/Pendingsellermoney");
const Product = require("../models/Product");
const Pendingsellermoney = require("../models/Pendingsellermoney");
const UserTransaction = require("../models/InfluencerTransaction");
dotenv.config();
const { S3Client, PutObjectCommand, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const bucketNAME = process.env.BUCKET_NAME;
const bucketREGION = process.env.BUCKET_REGION;
const accessKEY = process.env.ACCESS_KEY;
const secretaccess = process.env.SECRETACCESS;

const s3 = new S3Client({
    region: bucketREGION,
    credentials: {
        accessKeyId: accessKEY,
        secretAccessKey: secretaccess
    },
})

//Register MainAdmin
router.post("/register" ,
    [
        body('email', 'Enter your valid email').isEmail(),
        body('username', "Enter a valid username").isLength({ min: 3 }),
        body('password').isLength({ min: 5 }),
        body('phoneNumber' , "Number must be 10 digit").isLength({ min: 10 }),
    ], async(req, res) =>{
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array("Some error occure")});
      }
    try {
        let mainadmin = await MainAdmin.findOne({email: req.body.email});
        if(mainadmin){
            return res.status(400).json("Please login With correct password");
        }
       
        mainadmin = await MainAdmin.create({
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password:CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
            phoneNumber:req.body.phoneNumber,
             
          })
          const accessToken = jwt.sign({
            id:mainadmin._id,
            isAdmin: mainadmin.isAdmin,
        },process.env.ADMIN_SEC)
    
          res.status(200).json({mainadmin, accessToken})
        
    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})

//Login
router.post("/login" ,[
        body('email', 'Enter your valid email').isEmail(),
        body('password' , 'Password must be 5 char').isLength({ min: 5 }),
    
], async(req , res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array()});
  }
  try {
    let mainadmin = await MainAdmin.findOne({email: req.body.email});
    if(!mainadmin){
        return res.status(400).json("Some Error occure ")
    }
     const hashPassword = CryptoJS.AES.decrypt(mainadmin.password, process.env.PASS_SEC);
     const Newpassword = hashPassword.toString(CryptoJS.enc.Utf8);
     Newpassword!== req.body.password && res.status(400).json({error:"Please try to login with correct credendial"});
    const {password ,phoneNumber, ...others} = mainadmin._doc;
    const accessToken = jwt.sign({
        id:mainadmin._id,
        isMainAdmin: mainadmin.isMainAdmin,
    },process.env.ADMIN_SEC)
    res.json({...others,accessToken})
        
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
    
})

//Get all the user
router.get("/user",mainAdminverifyToken , async(req , res)=>{
    try {
        let user = await User.find()
        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})


//Get all Seller
router.get("/seller", mainAdminverifyTokenAndAdmin , async(req , res)=>{
    try {
        let seller = await Seller.find();
        res.status(200).json(seller)
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
})

//Get all influencer
// router.get("/influencer", mainAdminverifyTokenAndAdmin , async(req , res)=>{
//   try {
//       let user = await User.find();
//       res.status(200).json(user);
//   } catch (error) {
//       return res.status(500).json("Internal server error");
//   }
// })

//Get Seller by id
router.get("/seller/:id", mainAdminverifyTokenAndAdmin , async(req , res)=>{
  try {
      let seller = await Seller.find(req.params.id);
      res.status(200).json(seller)
  } catch (error) {
      return res.status(500).json("Internal server error");
  }
})

//Get user not influencer by id
router.get("/influencer/:id", mainAdminverifyTokenAndAdmin , async(req , res)=>{
  try {
      let user = await User.find(req.params.id);
      res.status(200).json(user)
  } catch (error) {
      return res.status(500).json("Internal server error");
  }
})

// one Seller product - For MainAdmin
router.get("/seller/product/by/:id" ,mainAdminverifyToken, async(req , res)=>{
    try {
        const sellerProduct = await Product.find({seller : req.params.id});
        if(!sellerProduct){
            return res.status(403).json("Seller not have product");
        }else{
            res.status(200).json(sellerProduct)
        } 
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
})


//One Seller pending orders
router.get("/get/pending/userOrders/:id", mainAdminverifyToken, async (req, res) => {
  try {
    const userOrder = await Order.find({ orderItems: { $elemMatch: {seller : req.params.id}  } });
    if (!userOrder) {
      return res.status(400).json("Orders not found")
    }
    const pendingUserOrder = await Promise.all(
      userOrder.map((item) => {
        if (item.orderStatus !== "Delivered" && item.orderStatus !== "Return completed" && item.orderStatus !== "Return processing" && item.orderStatus !== "Return Pickup"  ) {
          return item
        }
      })
    )
    const item = pendingUserOrder.filter(x => x !== undefined);
    res.status(200).json(item); 
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
  })


  //Seller RETURN PENDING orders FOR MAINADMIN
router.get("/get/return/userOrders/:id", mainAdminverifyToken, async (req, res) => {
  try {
    const userOrder = await Order.find({ orderItems: { $elemMatch: {seller : req.params.id}  } });
    if (!userOrder) {
      return res.status(400).json("Orders not found")
    }
    console.log("Return order")
    const pendingUserOrder = await Promise.all(
      userOrder.map((item) => {
        if (item.orderStatus === "Return processing" && item.orderStatus === "Return Pick up") {
          return item
        }
      })
    )
    const item = pendingUserOrder.filter(x => x !== undefined);
    res.status(200).json(item); 
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
})



// Find seller username
router.get("/address/seller/:id" ,mainAdminverifyToken, async(req , res)=>{
  try {
    let seller = await Seller.findById(req.params.id).select(["+password" , "+startAt" , "+email" , "phoneNumber" , "shopname" , "shopAddress" , "Pan_Number" , "National_id" ,"+Post_Number" ,"avatar" , "+username" , "+paymentDateAt" , "+paymentPendingDate" , "+isSeller" , "city" , "+updatedAt" ] );
    if(!seller){
      return res.status(400).json("Some Error occure ")
    }
    const {password  ,isSeller , National_id ,email ,avatar ,paymentDateAt,paymentPendingDate , _id ,createdAt , updatedAt ,  ...others} = seller._doc;
    res.json(others)
    
  } catch (error) {
    return res.status(400).json("Internal error occured")
  }

})















// Get all user order and Income -- seller 7 days
router.get("/get/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (!seller){
    return res.status(400).json("Seller is not found")
  }else{
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id }}});
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };


  let Startat = new Date(seller?.startAt);
  let paymentDateAtFirst = new Date(seller?.paymentDateAt);

  console.log(Startat ,  'StartAt')

  let joinUpdate = new Date(seller?.startAt);
  let paymentDateAt = new Date(seller?.paymentDateAt);
  let nowDate = new Date(seller?.startAt);
  let Month = new Date(seller?.paymentDateAt);

  console.log(paymentDateAt , "rtrtrtrtrtr")

  console.log(joinUpdate,"joinupdate")
  console.log(nowDate,"NowDate")
  let orderItems;
  let Sales = 0;
  let Amount = 0;
  let commission = 0;


  

  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= Startat || order.deliveredAt >= Startat){
        if (order.createdAt <= paymentDateAtFirst || order.deliveredAt <= paymentDateAtFirst) {
          if (order.orderStatus == "Delivered") {
            orderItems = order.orderItems;
            orderItems.map((items) => {
              Sales += items.price * items.quantity;
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Mobile and laptop") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Computer and PC Part") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Phone and Tablet Accessories") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "TV and Video Accessories") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Video Games and Consoles") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Large Appliances") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Drones and 3D Printed Products") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Beauty and Personal Care") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Camera and Accessories") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Smartwatches") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Generators and Power Suppliers") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Audio device") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Home Storage Supplies") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
            });
            return order;
          }
        }
      }
    })
  )
  let items = orderall.filter(x => x !== undefined);
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();

  let now = new Date();
  if (new Date() > paymentDateAt) {
    for (let RightNow = now; paymentDateAt < RightNow;) {
      
      const PendingMoney = new Pendingsellermoney({
        seller: seller._id,
        amount: Amount,
        status: "Pending",
      });

      
      // save the Transfermoney object to the database
      await PendingMoney.save();

      nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() + 7));
      Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() + 7));

      try {
        const updateuser = await Seller.findByIdAndUpdate(seller._id, {
          "startAt": nowDate,
          "paymentPendingDate": Month,
          "paymentDateAt": Month
        });
      } catch (error) {
      }
    }
  }


  res.status(200).json({ success: true, Sales, items, amount, marketplace });
  }

});


// Get all user order and Income -- user
router.get("/get/affid/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json("user is not found")
  }else{
  const orders = await Order.find({ orderItems: { $elemMatch: {affid:req.params.id}}});
  console.log(orders)
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };
  let joinUpdate = new Date(user?.startAt);
  let paymentDateAt = new Date(user?.paymentDateAt);
  let nowDate = new Date(user?.startAt);
  let Month = new Date(user?.paymentDateAt);

  // console.log(joinUpdate);
  // console.log(paymentDateAt);
  
  let now = new Date();

  
  let orderItems;
  let Sales = 0;
  let commission = 0;


  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= joinUpdate || order.deliveredAt >= joinUpdate) {
        if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
          if (order.orderStatus == "Delivered") {
              orderItems = order.orderItems;
              orderItems.map((items) => {
              Sales += items.price * items.quantity;
                if (items.subcategories == "Casual Shirts") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                }
                else if (items.subcategories == "Men's Fashion") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                 }
                else if (items.subcategories == "men shoes") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                }
                else if (items.subcategories == "Women's Shoes") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                }
                else if (items.subcategories == "Mobile and laptop") {
                  commission += (items.price * items.quantity) * 1 / 100;
                }
                else if (items.subcategories == "Computer and PC Part") {
                  commission += (items.price * items.quantity) * 3.20 / 100;
                }
                else if (items.subcategories == "Phone and Tablet Accessories") {
                  commission += (items.price * items.quantity) * 3.21 / 100;
                 }
                else if (items.subcategories == "TV and Video Accessories") {
                  commission += (items.price * items.quantity) * 1 / 100;
                }
                else if (items.subcategories == "Video Games and Consoles") {
                  commission += (items.price * items.quantity) * 1 / 100;
                 }
                else if (items.subcategories == "Large Appliances") {
                  commission += (items.price * items.quantity) * 1 / 100;
                 }
                else if (items.subcategories == "Drones and 3D Printed Products") {
                  commission += (items.price * items.quantity) * 2 / 100;
                 }
                else if (items.subcategories == "Lighting Bulbs") {
                  commission += (items.price * items.quantity) * 2.51 / 100;
                 }
                else if (items.subcategories == "Beauty and Personal Care") {
                  commission += (items.price * items.quantity) * 2.20 / 100;
               }
                else if (items.subcategories == "Camera and Accessories") {
                  commission += (items.price * items.quantity) * 1.01 / 100;
                }
                else if (items.subcategories == "Smartwatches") {
                  commission += (items.price * items.quantity) * 2 / 100;
               }
                else if (items.subcategories == "Generators and Power Suppliers") {
                  commission += (items.price * items.quantity) * 2 / 100;
               }
                else if (items.subcategories == "Audio device") {
                  commission += (items.price * items.quantity) * 1.3 / 100;
               }
                else if (items.subcategories == "Home Storage Supplies") {
                  commission += (items.price * items.quantity) * 2.01 / 100;
                }
             });
              return order;
           }
         }
       }
     })
   )
  let items = orderall.filter(x => x !== undefined);
  let Income = commission.toFixed();

  if (new Date() > paymentDateAt) {
    console.log("Layer one")
    for (let RightNow = now; paymentDateAt < RightNow;) {
      console.log("Layer two")
      const PendingMoney = new InfluencerTransaction({
        user: req.user.id,
        amount: Income,
        Sales:Sales,
        status: "Pending",
      });
      
      // save the Transfermoney object to the database
      await PendingMoney.save();

      nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() + 28));
      Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() + 28));
      
      try {
        const updateuser = await User.findByIdAndUpdate(req.user.id, {
          "startAt": nowDate,
          "paymentPendingDate": Month,
          "paymentDateAt": Month
        });
      } catch (error) {
      }
    }
  };
  return res.status(200).json({ success: true, Sales, items,  Income });
  }

});


// Get all user order and Income -- user 1 month ago
router.get("/get/one/month/ago/affid/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(400).json("user is not found")
  }else{
  const orders = await Order.find({ orderItems: { $elemMatch: {affid:req.params.id}}});
  console.log(orders)
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };
  let joinUpdate = new Date(user?.startAt);
  let paymentDateAt = new Date(user?.paymentDateAt);
  let nowDate = new Date(user?.startAt);
  let Month = new Date(user?.paymentDateAt);

  // console.log(joinUpdate);
  // console.log(paymentDateAt);
  
  let now = new Date();
  if (new Date() > paymentDateAt) {
    for (let RightNow = now; paymentDateAt < RightNow;) {
      nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() - 28));
      Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() - 28));
      
    }
  };
  
  let orderItems;
  let Sales = 0;
  let commission = 0;
  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= joinUpdate || order.deliveredAt >= joinUpdate) {
        if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
          if (order.orderStatus == "Delivered") {
              orderItems = order.orderItems;
              orderItems.map((items) => {
              Sales += items.price * items.quantity;
                if (items.subcategories == "Casual Shirts") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                }
                else if (items.subcategories == "Men's Fashion") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                 }
                else if (items.subcategories == "men shoes") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                }
                else if (items.subcategories == "Women's Shoes") {
                  commission += (items.price * items.quantity) * 3.2 / 100;
                }
                else if (items.subcategories == "Mobile and laptop") {
                  commission += (items.price * items.quantity) * 1 / 100;
                }
                else if (items.subcategories == "Computer and PC Part") {
                  commission += (items.price * items.quantity) * 3.20 / 100;
                }
                else if (items.subcategories == "Phone and Tablet Accessories") {
                  commission += (items.price * items.quantity) * 3.21 / 100;
                 }
                else if (items.subcategories == "TV and Video Accessories") {
                  commission += (items.price * items.quantity) * 1 / 100;
                }
                else if (items.subcategories == "Video Games and Consoles") {
                  commission += (items.price * items.quantity) * 1 / 100;
                 }
                else if (items.subcategories == "Large Appliances") {
                  commission += (items.price * items.quantity) * 1 / 100;
                 }
                else if (items.subcategories == "Drones and 3D Printed Products") {
                  commission += (items.price * items.quantity) * 2 / 100;
                 }
                else if (items.subcategories == "Lighting Bulbs") {
                  commission += (items.price * items.quantity) * 2.51 / 100;
                 }
                else if (items.subcategories == "Beauty and Personal Care") {
                  commission += (items.price * items.quantity) * 2.20 / 100;
               }
                else if (items.subcategories == "Camera and Accessories") {
                  commission += (items.price * items.quantity) * 1.01 / 100;
                }
                else if (items.subcategories == "Smartwatches") {
                  commission += (items.price * items.quantity) * 2 / 100;
               }
                else if (items.subcategories == "Generators and Power Suppliers") {
                  commission += (items.price * items.quantity) * 2 / 100;
               }
                else if (items.subcategories == "Audio device") {
                  commission += (items.price * items.quantity) * 1.3 / 100;
               }
                else if (items.subcategories == "Home Storage Supplies") {
                  commission += (items.price * items.quantity) * 2.01 / 100;
                }
             });
              return order;
           }
         }
       }
     })
   )
  let items = orderall.filter(x => x !== undefined);
  let Income = commission.toFixed();
  console.log(Income)
  return res.status(200).json({ success: true, Sales, items,  Income });
  }

});




// Get all user previous week order and Income -- seller
router.get("/get/previos/one/week/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  const seller = await Seller.findById(req.params.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };
  let datefor = new Date(seller.startAt);
  let PreviousPaymentdAt = new Date(seller.paymentDateAt);

  let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 7));
  let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 7));

  console.log(startatForPrev , "oneweek , startatForPrev")
  console.log(paymentDateAt , "oneweek , paymentDateAt")
  let now = new Date();

  let orderItems;
  let Sales = 0;
  let Amount = 0;
  let commission = 0;

  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
        if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
          if (order.orderStatus == "Delivered") {
            orderItems = order.orderItems;
            orderItems.map((items) => {
              Sales += items.price * items.quantity;
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
             
              else if (items.subcategories == "Books") {
                commission += (items.price * items.quantity) * 8.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty and Personal Care") {
                commission += (items.price * items.quantity) * 9.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              
            });
            return order;
          }
        }
      }
    })
  )

  let items = orderall.filter(x => x !== undefined);
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });
  
}
);

// Get all user 2 weeks ago order and Income -- seller
router.get("/get/two/weeks/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  try {

  const seller = await Seller.findById(req.params.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };

  let datefor = new Date(seller.startAt);
  let PreviousPaymentdAt = new Date(seller.paymentDateAt);

  let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 14));
  let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 14));

  console.log(startatForPrev , "oneweek , startatForPrev")
  console.log(paymentDateAt , "oneweek , paymentDateAt")

  let orderItems;
  let Sales = 0;
  let Amount = 0;
  let commission = 0;

  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
        if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
          if (order.orderStatus == "Delivered") {
            orderItems = order.orderItems;
            orderItems.map((items) => {
              Sales += items.price * items.quantity;
              if (items.subcategories == "Women's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kid's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Books") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty and Personal Care") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
            
            });
            return order;
          }
        }
      }
    })
  )

  let items = orderall.filter(x => x !== undefined);
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });
      
} catch (error) {
   return res.status(500).json("Internal error occured")
}
});


// Get all user 3 week ago order and Income -- seller
router.get("/get/previous/three/weeks/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  try {
  const seller = await Seller.findById(req.params.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };
  let datefor = new Date(seller.startAt);
  let PreviousPaymentdAt = new Date(seller.paymentDateAt);

  let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 21));
  let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 21));

  console.log(startatForPrev , "oneweek , startatForPrev")
  console.log(paymentDateAt , "oneweek , paymentDateAt")


  let orderItems;
  let Sales = 0;
  let Amount = 0;
  let commission = 0;

  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
        if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
          if (order.orderStatus == "Delivered") {
            orderItems = order.orderItems;
            orderItems.map((items) => {
              Sales += items.price * items.quantity;
              if (items.subcategories == "Women's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kid's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Books") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty and Personal Care") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
            });
            return order;
          }
        }
      }
    })
  )

  let items = orderall.filter(x => x !== undefined);
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });   
 } catch (error) {
    return res.status(500).json("Internal error occured")
}
});


// Get all user 4 weeks ago order and Income -- seller
router.get("/get/previous/four/weeks/userOrder/:id", mainAdminverifyToken, async (req, res) => {
  try {
  const seller = await Seller.findById(req.params.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
  if (!orders) {
    return res.status(200).json("You don't have any order");
  };
  let datefor = new Date(seller.startAt);
  let PreviousPaymentdAt = new Date(seller.paymentDateAt);

  let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 28));
  let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 28));


  console.log(startatForPrev , "oneweek , startatForPrev")
  console.log(paymentDateAt , "oneweek , paymentDateAt")


  let orderItems;
  let Sales = 0;
  let Amount = 0;
  let commission = 0;

  const orderall = await Promise.all(
    orders.map((order) => {
      if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
        if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
          if (order.orderStatus == "Delivered") {
            orderItems = order.orderItems;
            orderItems.map((items) => {
              Sales += items.price * items.quantity;
              if (items.subcategories == "Women's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kid's Fashion") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Books") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty and Personal Care") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
            });
            return order;
          }
        }
      }
    })
  )

  let items = orderall.filter(x => x !== undefined);
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });   
 } catch (error) {
    return res.status(500).json("Internal error occured")
}
});

// Get all user order and Income by seller for mainAdmin
// router.get("/get/seller/income/:id", mainAdminverifyToken, async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.params.id);
//     if (!seller) {
//       return res.status(400).json("Seller does't exist");
//     }
//     const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
//     if (!orders) {
//       return res.status(200).json("You don't have any order");
//     };
//     let joinUpdate = new Date(seller?.startAt);
//     let paymentDateAt = new Date(seller?.paymentDateAt);
//     let nowDate = new Date(seller?.startAt);
//     let Month = new Date(seller?.paymentDateAt);
  
//     let now = new Date();
//     if (new Date() > paymentDateAt) {
//       for (let RightNow = now; paymentDateAt < RightNow;) {
//         nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() + 14));
//         Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() + 14));
        
//         try {
//           const updateuser = await Seller.findByIdAndUpdate(req.params.id, {
//             "startAt": nowDate,
//             "paymentDateAt": Month
//           });
//         } catch (error) {
//           return res.status(400).json("Internal error occured")
//         }
//       }
//     };
//     let orderItems;
//     let Sales = 0;
//     let Amount = 0;
//     let commission = 0;
//     const orderall = await Promise.all(
//       orders.map((order) => {
//         if (order.createdAt >= joinUpdate || order.deliveredAt >= joinUpdate) {
//           if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
//             if (order.orderStatus == "Delivered") {
//               orderItems = order.orderItems;
//               orderItems.map((items) => {
//                 Sales += items.price * items.quantity;
//                 if (items.categories == "Women's Fashion") {
//                   commission += (items.price * items.quantity) * 13.2 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//                 }
//                 else if (items.categories == "Men's Fashion") {
//                   commission += (items.price * items.quantity) * 13.2 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//                 }
//                 else if (items.categories == "Phones & Tablets") {
//                   commission += (items.price * items.quantity) * 2.90 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
//                 }
//                 else if (items.categories == "Phone & Tablet Accessories") {
//                   commission += (items.price * items.quantity) * 13.20 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
//                 }
//                 else if (items.categories == "Mac Accessories") {
//                   commission += (items.price * items.quantity) * 8.21 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
//                 }
//                 else if (items.categories == "TV and Video Accessories") {
//                   commission += (items.price * items.quantity) * 3.20 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
//                 }
//                 else if (items.categories == "Video Games & Consoles") {
//                   commission += (items.price * items.quantity) * 10.2 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//                 }
//                 else if (items.categories == "Large Appliances") {
//                   commission += (items.price * items.quantity) * 3 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
//                 }
//                 else if (items.categories == "3D Printed Products") {
//                   commission += (items.price * items.quantity) * 8 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
//                 }
//                 else if (items.categories == "Lighting Bulbs") {
//                   commission += (items.price * items.quantity) * 9.01 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
//                 }
//                 else if (items.categories == "Beauty & Health") {
//                   commission += (items.price * items.quantity) * 10.20 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
//                 }
//                 else if (items.categories == "camera") {
//                   commission += (items.price * items.quantity) * 3.01 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
//                 }
//                 else if (items.categories == "Smartwatches") {
//                   commission += (items.price * items.quantity) * 10 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
//                 }
//                 else if (items.categories == "Generators & Power Suppliers") {
//                   commission += (items.price * items.quantity) * 5 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
//                 }
//                 else if (items.categories == "Audio") {
//                   commission += (items.price * items.quantity) * 5 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
//                 }
//                 else if (items.categories == "Home Storage Supplie") {
//                   commission += (items.price * items.quantity) * 8.01 / 100;
//                   Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
//                 }
//               });
//               return order;
//             }
//           }
//         }
//       })
//     )
//     let items = orderall.filter(x => x !== undefined);
//     let amount = Amount.toFixed();
//     let marketplace = commission.toFixed();
//     res.status(200).json({ success: true, Sales, items, amount, marketplace });
        
//   } catch (error) {
//     return res.status(500).json("Internal error occured")
//   }
// });
  
  
  
  // Get all user previous week order and Income -- seller
  // router.get("/get/previos/week/seller/income/:id", mainAdminverifyToken, async (req, res) => {
  //   try {
  //   const seller = await Seller.findById(req.params.id);
  //   if (!seller) {
  //     return res.status(400).json("Seller not found")
  //   }
  //   const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
  //   if (!orders) {
  //     return res.status(200).json("You don't have any order");
  //   };
  //   let datefor = new Date(seller.startAt);
  //   let joinUpdate = new Date(seller.startAt);
  //   let paymentDateAt = new Date(joinUpdate.setDate(joinUpdate.getDate() - 14));
  //   console.log(datefor)
  //   console.log(paymentDateAt);
  //   let orderItems;
  //   let Sales = 0;
  //   let Amount = 0;
  //   let commission = 0;
  
  //   const orderall = await Promise.all(
  //     orders.map((order) => {
  //       if (order.createdAt <= datefor || order.deliveredAt <= datefor) {
  //         if (order.createdAt >= paymentDateAt || order.deliveredAt >= paymentDateAt) {
  //           if (order.orderStatus == "Delivered") {
  //             orderItems = order.orderItems;
  //             orderItems.map((items) => {
  //               Sales += items.price * items.quantity;
  //               if (items.categories == "Women's Fashion") {
  //                 commission += (items.price * items.quantity) * 13.2 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
  //               }
  //               else if (items.categories == "Men's Fashion") {
  //                 commission += (items.price * items.quantity) * 13.2 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
  //               }
  //               else if (items.categories == "Phones & Tablets") {
  //                 commission += (items.price * items.quantity) * 2.90 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
  //               }
  //               else if (items.categories == "Phone & Tablet Accessories") {
  //                 commission += (items.price * items.quantity) * 13.20 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.20 / 100;
  //               }
  //               else if (items.categories == "Mac Accessories") {
  //                 commission += (items.price * items.quantity) * 8.21 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
  //               }
  //               else if (items.categories == "TV and Video Accessories") {
  //                 commission += (items.price * items.quantity) * 3.20 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
  //               }
  //               else if (items.categories == "Video Games & Consoles") {
  //                 commission += (items.price * items.quantity) * 10.2 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 10.2 / 100;
  //               }
  //               else if (items.categories == "Large Appliances") {
  //                 commission += (items.price * items.quantity) * 3 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
  //               }
  //               else if (items.categories == "3D Printed Products") {
  //                 commission += (items.price * items.quantity) * 8 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
  //               }
  //               else if (items.categories == "Lighting Bulbs") {
  //                 commission += (items.price * items.quantity) * 9.01 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
  //               }
  //               else if (items.categories == "Beauty & Health") {
  //                 commission += (items.price * items.quantity) * 10.20 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
  //               }
  //               else if (items.categories == "camera") {
  //                 commission += (items.price * items.quantity) * 3.01 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
  //               }
  //               else if (items.categories == "Smartwatches") {
  //                 commission += (items.price * items.quantity) * 10 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
  //               }
  //               else if (items.categories == "Sports & Travel") {
  //                 commission += (items.price * items.quantity) * 9 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9 / 100;
  //               }
  //               else if (items.categories == "Generators & Power Suppliers") {
  //                 commission += (items.price * items.quantity) * 5 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
  //               }
  //               else if (items.categories == "Books & Stationery") {
  //                 commission += (items.price * items.quantity) * 8 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
  //               }
  //               else if (items.categories == "Automotive & Motorcycles") {
  //                 commission += (items.price * items.quantity) * 8 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
  //               }
  //               else if (items.categories == "Audio") {
  //                 commission += (items.price * items.quantity) * 5 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
  //               }
  //               else if (items.categories == "Home Storage Supplie") {
  //                 commission += (items.price * items.quantity) * 8.01 / 100;
  //                 Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
  //               }
  //             });
  //             return order;
  //           }
  //         }
  //       }
  //     })
  //   )
  
  //   let items = orderall.filter(x => x !== undefined);
  //   let amount = Amount.toFixed();
  //   let marketplace = commission.toFixed();
  //   res.status(200).json({ success: true, Sales, items, amount, marketplace });
          
  // } catch (error) {
  //     return res.status(500).json("Internal error occured")
  // }
    
  // });


// Get all user order and return order -- seller
// router.get("/get/return/userOrder/:id", mainAdminverifyToken, async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.params.id);
//     if (!seller) {
//       console.log("something is wrong");
//     }
//     const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.params.id } } });
//     const orderall = await Promise.all(
//       orders.map((order) => {
//             if (item.orderStatus === "Return processing" && item.orderStatus === "Return pickup" && item.orderStatus !== "Return Complected") {
//               return order;
//             }; 
//       })
//     )
//     let items = orderall.filter(x => x !== undefined);
//     res.status(200).json({ success: true, items });
        
//   } catch (error) {
//     return res.status(500).json("Interna; error occured")
//   }
//   });

  // Get all user order and Income -- influencer
// router.get("/get/affid/userOrder/:id", mainAdminverifyToken, async (req, res) => {
//   try {
//   const user = await User.findById(req.params.id);
//   if (!user) {
//     return res.status(400).json("Seller doesn't found")
//   }else{
//   const orders = await Order.find({ orderItems: { $elemMatch: {affid:req.params.id}}});
//   if (!orders) {
//     return res.status(200).json("You don't have any order");
//   };
  
//   let joinUpdate = new Date(user?.startAt);
//   let paymentDateAt = new Date(user?.paymentDateAt);
//   let nowDate = new Date(user?.startAt);
//   let Month = new Date(user?.paymentDateAt);
  
//   let now = new Date();
//   if (new Date() > paymentDateAt) {
//     for (let RightNow = now; paymentDateAt < RightNow;) {
//       nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() + 14));
//       Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() + 14));
//       // try {
//         const updateuser = await User.findByIdAndUpdate(req.params.id, {
//           "startAt": nowDate,
//           "paymentDateAt": Month
//         });
        
//       // } catch (error) {
//       //   return res.status(400).json("Internal error occured")
//       // }
//       }
      
//   };
  
//   let orderItems;
//   let Sales = 0;
//   let commission = 0;
//   const orderall = await Promise.all(
//     orders.map((order) => {
//       if (order.createdAt >= joinUpdate || order.deliveredAt >= joinUpdate) {
//         if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
//           if (order.orderStatus == "Delivered"){
//             orderItems = order.orderItems;
//             orderItems.map((items) => {
//               Sales += items.price * items.quantity;
//               if (items.subcategories == "Women's Fashion") {
//                 commission += (items.price * items.quantity) * 3.2 / 100;
                
//               }
//               else if (items.subcategories == "Casual Shirts") {
//                 commission += (items.price * items.quantity) * 3.2 / 100;
                
//               }
//               else if (items.subcategories == "Men's Shoes") {
//                 commission += (items.price * items.quantity) * 3.2 / 100;
//               }
//               else if (items.subcategories == "Women's Shoes") {
//                 commission += (items.price * items.quantity) * 3.2 / 100;
//               }
//               else if (items.subcategories == "Mobile and laptop") {
//                 commission += (items.price * items.quantity) * 1 / 100;
//               }
//               else if (items.subcategories == "Computer and PC Part") {
//                 commission += (items.price * items.quantity) * 3.20 / 100;
//               }
//               else if (items.subcategories == "Phone and Tablet Accessories") {
//                 commission += (items.price * items.quantity) * 3.21 / 100;
//               }
//               else if (items.subcategories == "TV and Video Accessories") {
//                 commission += (items.price * items.quantity) * 1 / 100;
//               }
//               else if (items.subcategories == "Video Games and Consoles") {
//                 commission += (items.price * items.quantity) * 1 / 100;
//               }
//               else if (items.subcategories == "Large Appliances") {
//                 commission += (items.price * items.quantity) * 1 / 100;
//               }
//               else if (items.subcategories == "Drones and 3D Printed Products") {
//                 commission += (items.price * items.quantity) * 2 / 100;
//               }
//               else if (items.subcategories == "Lighting Bulbs") {
//                 commission += (items.price * items.quantity) * 2.51 / 100;
//               }
//               else if (items.subcategories == "Beauty and Personal Care") {
//                 commission += (items.price * items.quantity) * 2.20 / 100;
//               }
//               else if (items.subcategories == "Camera and Accessories") {
//                 commission += (items.price * items.quantity) * 1.01 / 100;
//               }
//               else if (items.subcategories == "Smartwatches") {
//                 commission += (items.price * items.quantity) * 2 / 100;
//               }
//               else if (items.subcategories == "Generators and Power Suppliers") {
//                 commission += (items.price * items.quantity) * 2 / 100;
//               }
//               else if (items.subcategories == "Audio device") {
//                 commission += (items.price * items.quantity) * 1.3 / 100;

//               }
//               else if (items.subcategories == "Home Storage Supplies") {
//                 commission += (items.price * items.quantity) * 2.01 / 100;
//               }
//             });
//             return order;
//           }
//         }
//       }
//     })
//   )
//   let items = orderall.filter(x => x !== undefined);
//   let Income = commission.toFixed();
//   res.status(200).json({ success: true, Sales, items,  Income });
//   }   
// } catch (error) {
//     return res.status(500).json("Internal error occured")
// }

// });


//Get a influencer bank
router.get("/influencer/accountdetail/:id" , mainAdminverifyToken , async(req , res)=>{
  try {
      const user = await UserBankAccount.find({user : req.params.id});
      if(!user){
          return res.status(403).json("Some error occured");
      }
      res.status(200).json(user);      
  } catch (error) {
      return res.status(500).json("Internal error occured")
  }
})


///
  router.get("/accountdetail/:id" , mainAdminverifyToken , async(req , res)=>{
    try {
        const account = await BankAccount.find({seller:req.params.id});
        res.json(account)
    } catch (error) {
      return res.status(400).json('Some error occured')
    }
})

//Influencer bank details
router.get("/influencer/accountdetail/:id" , mainAdminverifyToken , async(req , res)=>{
  try {
      const account = await UserBankAccount.find({user:req.params.id});
      res.json(account)
  } catch (error) {
    return res.status(400).json('Some error occured')
  }
})


//Influencer bank details
router.get("/influencer/pendingOrders/:id" , mainAdminverifyToken , async(req , res)=>{
  try {
      const Pendingorders = await Order.find({ orderItems: { $elemMatch: {affid:req.params.id}}});
      // if(Pendingorders.orderStatus == 'Delivered'){
        res.json(Pendingorders);
      // }
  } catch (error) {
    return res.status(400).json('Some error occured')
  }
})

//Get seller complete transaction
router.get("/get/complete/transaction/:id" , mainAdminverifyToken , async(req, res)=>{
  try {
    const sellerTransaction = await Transfermoney.findById(req.params.id);
    console.log(sellerTransaction);
  } catch (error) {

  }
}) 

///Get Pending order
router.get("/get/all/pending/order" , mainAdminverifyToken , async(req , res)=>{
  // try {
    const userOrder = await Order.find();
    const pendingUserOrder = await Promise.all(
      userOrder.map(async(item) => {
        if (item.orderStatus !== "Delivered" && item.orderStatus !== "Return processing" && item.orderStatus !== "Return completed" && item.orderStatus !== "Return Pick up" ) {
         let orderItem = await Promise.all(item.orderItems.map(async undersubitem => {
          let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
       
         // Create a GetObjectCommand with the necessary parameters
         const command = new GetObjectCommand({
           Bucket: bucketNAME,
           Key: imageKey,
         });
           const url = await getSignedUrl(s3, command);
           return url;
           }))

           undersubitem.imgKey = images;
           return undersubitem
         }))
         console.log(item)
         return item
           }})
          
       )
       const item = pendingUserOrder.filter(x => x !== undefined);
       res.status(200).json(item); 
  // } catch (error) {
  //   return res.status(500).json("Internal error occured")
  // }
})

//Get Return Pending order two are same
router.get("/get/return/pending/order" , mainAdminverifyToken , async(req , res)=>{
  // try {
    const userOrder = await Order.find();
    const pendingUserOrder = await Promise.all(
      userOrder.map(async(item) => {
        if (item.orderStatus === "Return processing" || item.orderStatus === "Return pick up" ) {
          let orderItem = await Promise.all(item.orderItems.map(async undersubitem => {
            let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
         
           // Create a GetObjectCommand with the necessary parameters
           const command = new GetObjectCommand({
             Bucket: bucketNAME,
             Key: imageKey,
           });
             const url = await getSignedUrl(s3, command);
             return url;
             }))
  
             undersubitem.imgKey = images;
             return undersubitem
           }))
           console.log(item)
           return item
        }
      })
    )
    const item = pendingUserOrder.filter(x => x !== undefined);
    res.status(200).json(item); 
  // } catch (error) {
  //   return res.status(500).json("Internal error occured")
  // }
})


//Get All Return Pending order for main Admin two are same
router.get("/get/return/order" , mainAdminverifyToken , async(req , res)=>{
  try {
    const userOrder = await Order.find();
    const pendingUserOrder = await Promise.all(
      userOrder.map((item) => {
        if (item.orderStatus === "Return processing" && item.orderStatus === "Return Pick up") {
          return item
        }
      })
    )
    const item = pendingUserOrder.filter(x => x !== undefined);
    res.status(200).json(item); 
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
})

// All product upload by Seller --- MainAdmin
router.get("/all/product/:id" , mainAdminverifyToken , async(req , res)=>{
  try {
      const product = await Product.find({seller : req.params.id});
      res.json(product);
  } catch (error) {
      return res.status(400).json("Internal Error occured")
  }
});


// Get a user pending details 
// router.get("/all/pending/order/:id" , mainAdminverifyToken , async(req , res)=>{
//   try {
//       const pendingorder = await Order.find(req.params.id);
//       res.status(200).json(pendingorder);
//   } catch (error) {
//       return res.status(400).json("Internal Error occured")
//   }
// });





//Get Single user order--- MainAdmin
router.get("/Single/orders/:id", mainAdminverifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email phoneNumber"
    );
    if (!order) {
      return res.status(400).json("Order is'not found");
    }
    res.status(201).json(order);
  } catch (error) {
    return res.status(500).json("Internal Error Occured");
  }
});


// update Return Order status -- mainAdmin
router.put("/update/status/:id" , mainAdminverifyToken , async (req, res) => {
  try {
  const orders = await Order.findById(req.params.id);
  // if (orders.orderStatus === "Delivered") {
  //   return res.status(400).json("You have already delivered this order");
  // }

  orders.orderStatus = req.body.status;

  // if (req.body.status === "Return Seller") {
  //   orders.deliveredAt = Date.now();
  // }
  await orders.save({ validatorBeforeSave: false });

  res.status(200).json({ success: true, msg:"Your OrderStatus has been change successfully" });

  } catch (error) {
      return res.status(500).json("Internal server error")
  }
});


//Sellers pendingAmount update 
router.put("/pending/payment/:id", mainAdminverifyToken, async (req, res) => {
  try {
  const PendingAmount = await Pendingsellermoney.findById(req.params.id);
  PendingAmount.status = req.body.status;
  
  await PendingAmount.save({ validatorBeforeSave: false });

  res.status(200).json("Seller Sucessfully got his payment");    
} catch (error) {
    return res.status(500).json("Internal error occured")
}
});


//Users pendingAmount update 
router.put("/user/pending/payment/:id", mainAdminverifyToken, async (req, res) => {
  try {
  const PendingAmount = await UserTransaction.findById(req.params.id);
  PendingAmount.status = req.body.status;
  
  await PendingAmount.save({ validatorBeforeSave: false });

  res.status(200).json("User Successfully get a income");    
} catch (error) {
    return res.status(500).json("Internal error occured")
}
});


module.exports = router;