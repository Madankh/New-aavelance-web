const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Influencer = require("../models/Influencer");
const Pendingsellermoney = require("../models/Pendingsellermoney")
const { mainAdminverifyToken } = require("./mainAdminverify");
const { sellerverifyToken } = require("./SellerverifyToken");
const { verifyToken, verifyTokenAndAdmin } = require("./verifyToken");
const Seller = require("../models/Seller");
const dotenv = require("dotenv");
const { InfluencerverifyToken } = require("./InfluencerverifyToken");
const User = require("../models/User");
const InfluencerTransaction = require("../models/InfluencerTransaction");
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
dotenv.config();



//create Order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { shippingInfo, orderItems, shipping_price, Total_amount, orderStatus, item_price, PaymentMethods , return_order_reason } = req.body;
    const order = await Order.create({ shippingInfo, item_price, orderItems, shipping_price, Total_amount, orderStatus, user: req.user.id, username:req.user.username, PaymentMethods , return_order_reason});
    res.status(201).json("You successfully order product");
  } catch (error) {
    return res.status(500).json("Internal error occured");
  }
});

//Delete Order
router.delete("/deleteOrder/:id", verifyToken, async (req, res) => {
  try {
    let orders = await Order.findById(req.params.id);
    if (!orders) {
      return res.status(404).json("Not found");
    }
    const ordersDelete = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Product was deleted successfully");
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

//Get logged in user order
router.get("/myOrder", verifyToken, async (req, res) => {
  try {
    let productss = await Order.find({ user: req.user.id }).sort({$natural:-1});
    if (!productss) {
      return res.status(404).json("Not found");
    }

    let products = await Promise.all(productss.map(async subitem => {
      let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
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
        return undersubitem;
      }))
      // Flatten the array of orderItems down to a single level
      subitem.orderItems = orderItem.flat();
      return subitem;
    }));
    
    // Flatten the array of products down to a single level
    products = products.flat();
    console.log(products)    
    

    res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

//Get Single user order --- Seller
router.get("/Single/order/:id", sellerverifyToken, async (req, res) => {
  try {
      const order = await Order.findById(req.params.id).populate("user", "username email phoneNumber");

      if (!order) {
          return res.status(400).json("Order is'not found");
      }
      // map over the subitems 
      const orderItems = await Promise.all(order.orderItems.map(async subitem => {
          // map over the subitems images 
          let images = await Promise.all(subitem.imgKey.map(async imageKey =>{
              // Create a GetObjectCommand with the necessary parameters
              const command = new GetObjectCommand({
                  Bucket: bucketNAME,
                  Key: imageKey,
              });
              // Get url from the s3 command
              const url = await getSignedUrl(s3, command).catch((err) => {
                  return res.status(500).json({ error: err.message });
              });
              return url;
          }))
          subitem.imgKey = images;
          return subitem;
      }))
      // assign the subitems to the order item
      order.orderItems = orderItems;
      // send the order
      res.status(201).json(order);
  } catch (error) {
      return res.status(500).json("Internal Error Occured");
  }
});



//Seller pending orders
router.get('/get/proccessing/userOrders', sellerverifyToken, async (req, res) => {
  const userOrder = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
  if (!userOrder) {
    return res.status(400).json("Orders not found");
  }
  const pendingUserOrder = await Promise.all(
    userOrder.map((item) => {
      if (item.orderStatus !== "Delivered" && item.orderStatus !== "Return processing"  && item.orderStatus !== "Return completed" ) {
        return item
      }
    })
  )
  const items = pendingUserOrder.filter(x => x !== undefined);

  let item = await Promise.all(items.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));
  
  // Flatten the array of products down to a single level
  item = item.flat();
  console.log(item)   
  
  res.status(200).json(item);
})

//Influencer pending orders
router.get('/get/affid/proccessing/userOrders', verifyToken, async (req, res) => {
  const userOrder = await Order.find({ orderItems: { $elemMatch: { affid: req.user.id } } });
  if (!userOrder) {
    return res.status(400).json("Orders not found");
  }
  const pendingUserOrder = await Promise.all(
    userOrder.map((item) => {
      if (item.orderStatus !== "Delivered" && item.orderStatus !== "Return processing" ) {
        return item
      }
    })
  )
  const item = pendingUserOrder.filter(x => x !== undefined);
  res.status(200).json(item);
})

// Get all user order and Income -- seller 7 days
router.get("/get/userOrder", sellerverifyToken, async (req, res) => {
  const seller = await Seller.findById(req.seller.id);
  if (!seller){
    return res.status(400).json("Seller is not found")
  }else{
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id }}});
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
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Hoodie") {
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
  let item = orderall.filter(x => x !== undefined);

  let items = await Promise.all(item.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));
  
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();

  let now = new Date();
  if (new Date() >= paymentDateAt) {
    for (let RightNow = now; paymentDateAt <= RightNow;) {

      const PendingMoney = new Pendingsellermoney({
        seller: req.seller.id,
        amount: Amount,
        status: "Pending",
        executeDate:paymentDateAt
      });

      
      // save the Transfermoney object to the database
      await PendingMoney.save();

      nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() + 7));
      Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() + 7));

      try {
        const updateuser = await Seller.findByIdAndUpdate(req.seller.id, {
          "startAt": nowDate,
          "paymentPendingDate": Month,
          "paymentDateAt": Month,
        });
      } catch (error) {
      }
    }
  }


  res.status(200).json({ success: true, Sales, items, amount, marketplace });
  }

});


// Get all user order and Income -- user
router.get("/get/affid/userOrder", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(400).json("user is not found")
  }else{
  const orders = await Order.find({ orderItems: { $elemMatch: {affid:req.user.id}}});
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
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Hoodie") {
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
  let item = orderall.filter(x => x !== undefined);

  let items = await Promise.all(item.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));


  let Income = commission.toFixed();

  if (new Date() >= paymentDateAt) {
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
router.get("/get/one/month/ago/affid/userOrder", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(400).json("user is not found")
  }else{
  const orders = await Order.find({ orderItems: { $elemMatch: {affid:req.user.id}}});
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
  if (new Date() >= paymentDateAt) {
    for (let RightNow = now; paymentDateAt < RightNow;) {
      nowDate = new Date(joinUpdate.setDate(joinUpdate.getDate() - 28));
      Month = new Date(paymentDateAt.setDate(paymentDateAt.getDate() - 28));
      // try {
      //   const updateuser = await User.findByIdAndUpdate(req.user.id, {
      //     "startAt": nowDate,
      //     "paymentDateAt": Month
      //   });
      // } catch (error) {
      // }
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
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Hoodie") {
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
  let Income = commission.toFixed();
  console.log(Income)
  return res.status(200).json({ success: true, Sales, items,  Income });
  }

});




// Get all user previous week order and Income -- seller
router.get("/get/previos/one/week/userOrder", sellerverifyToken, async (req, res) => {
  const seller = await Seller.findById(req.seller.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
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
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Hoodie") {
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

  let item = orderall.filter(x => x !== undefined);
  let items = await Promise.all(item.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });
  
}
);

// Get all user 2 weeks ago order and Income -- seller
router.get("/get/two/weeks/userOrder", sellerverifyToken, async (req, res) => {
  try {

  const seller = await Seller.findById(req.seller.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
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
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              
            
            });
            return order;
          }
        }
      }
    })
  )

  let item = orderall.filter(x => x !== undefined);

  let items = await Promise.all(item.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));


  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });
      
} catch (error) {
   return res.status(500).json("Internal error occured")
}
});


// Get all user 3 week ago order and Income -- seller
router.get("/get/previous/three/weeks/userOrder", sellerverifyToken, async (req, res) => {
  try {
  const seller = await Seller.findById(req.seller.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
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
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Hoodie") {
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

  let item = orderall.filter(x => x !== undefined);

  let items = await Promise.all(item.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));

  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });   
 } catch (error) {
    return res.status(500).json("Internal error occured")
}
});


// Get all user 4 weeks ago order and Income -- seller
router.get("/get/previous/four/weeks/userOrder", sellerverifyToken, async (req, res) => {
  try {
  const seller = await Seller.findById(req.seller.id);
  if (!seller) {
    return res.status(400).json("Seller not found")
  }
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
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
              if (items.subcategories == "T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Hoodie") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts & Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sarees") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Jeans") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shorts & Skirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Flats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boots") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sleepwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Tops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Co-ords") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Playsuits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Blazers & Waistcoats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Formal Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sweaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Trousers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Men's Bages") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals and Floaters") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Socks") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Personal Care & Grooming") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl T-Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Shirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Sweaters & Sweatshirts") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Jackets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Coats") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Suits") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Track Pants") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Casual Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Ethnic Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Nightwear & Loungewear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sandals & Heels") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Clothing sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Kurta Sets") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Boy Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Girl Party Wear") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Lehenge choli") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              
              else if (items.subcategories == "Flats & Flipflops") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }

              else if (items.subcategories == "Track Pants & Joggers") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Women's Shoes") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Beauty Tools") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Hair Care") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Skin Care") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Lipstick") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Lip Gloss") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Lip Liner") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Mascara") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Lighting Bulbs") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Eyeliner") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Kajal") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Foundation") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Nail Polish") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Face Moisturiser") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Cleanser") {
                commission += (items.price * items.quantity) * 8.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.01 / 100;
              }
              else if (items.subcategories == "Face Wash & Eye Cream") {
                commission += (items.price * items.quantity) * 13.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
              }
              else if (items.subcategories == "Sunscreen") {
                commission += (items.price * items.quantity) * 2.90 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 2.90 / 100;
              }
              else if (items.subcategories == "Body Lotion") {
                commission += (items.price * items.quantity) * 13.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.20 / 100;
              }
              else if (items.subcategories == "Lip Balm") {
                commission += (items.price * items.quantity) * 8.21 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8.21 / 100;
              }
              else if (items.subcategories == "Body Wash") {
                commission += (items.price * items.quantity) * 3.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.20 / 100;
              }
              else if (items.subcategories == "Body Scrub") {
                commission += (items.price * items.quantity) * 10.2 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
              }
              else if (items.subcategories == "Shampoo") {
                commission += (items.price * items.quantity) * 3 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3 / 100;
              }
              else if (items.subcategories == "Hair Cream") {
                commission += (items.price * items.quantity) * 8 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 8 / 100;
              }
              else if (items.subcategories == "Hair Oil") {
                commission += (items.price * items.quantity) * 9.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 9.01 / 100;
              }
              else if (items.subcategories == "Hair Gel") {
                commission += (items.price * items.quantity) * 10.20 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
              }
              else if (items.subcategories == "Hair Color") {
                commission += (items.price * items.quantity) * 3.01 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 3.01 / 100;
              }
              else if (items.subcategories == "Hair Accessory") {
                commission += (items.price * items.quantity) * 10 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 10 / 100;
              }
              else if (items.subcategories == "Fragrances") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;
              }
              else if (items.subcategories == "Men's Grooming") {
                commission += (items.price * items.quantity) * 5 / 100;
                Amount += items.price * items.quantity - (items.price * items.quantity) * 5 / 100;

              }
              else if (items.subcategories == "Hoodie") {
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

  let item = orderall.filter(x => x !== undefined);

  let items = await Promise.all(item.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
     let images = await Promise.all(undersubitem.imgKey.map(async imageKey =>{
  
    // Create a GetObjectCommand with the necessary parameters
    const command = new GetObjectCommand({
      Bucket: bucketNAME,
      Key: imageKey,
    });
      const url = await getSignedUrl(s3, command);
      return url;
      }))
      console.log(images)
      undersubitem.imgKey = images;
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));

  
  let amount = Amount.toFixed();
  let marketplace = commission.toFixed();
  res.status(200).json({ success: true, Sales, items, amount, marketplace });   
 } catch (error) {
    return res.status(500).json("Internal error occured")
}
});


// Get all user 1 month ago order and Income -- seller
// router.get("/get/previos/week/userOrder", sellerverifyToken, async (req, res) => {
//   const seller = await Seller.findById(req.seller.id);
//   if (!seller) {
//     return res.status(400).json("Seller not found")
//   }
//   const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
//   if (!orders) {
//     return res.status(200).json("You don't have any order");
//   };
//   let datefor = new Date(seller.startAt);
//   // let joinUpdate = new Date(seller.startAt);
//   let PreviousPaymentdAt = new Date(seller.paymentDateAt);
//   let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 28));
//   let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 28));
//   let now = new Date();

//   let orderItems;
//   let Sales = 0;
//   let Amount = 0;
//   let commission = 0;

//   const orderall = await Promise.all(
//     orders.map((order) => {
//       if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
//         if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
//           if (order.orderStatus == "Delivered") {
//             orderItems = order.orderItems;
//             orderItems.map((items) => {
//               Sales += items.price * items.quantity;
//               if (items.subcategories == "Women's Fashion") {
//                 commission += (items.price * items.quantity) * 10.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//               }
//               else if (items.subcategories == "Casual Shirts") {
//                 commission += (items.price * items.quantity) * 9.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//               }
//               else if (items.subcategories == "T-Shirts") {
//                 commission += (items.price * items.quantity) * 9.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//               }
//               else if (items.subcategories == "Books") {
//                 commission += (items.price * items.quantity) * 8.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//               }
//               else if (items.subcategories == "Beauty and Personal Care") {
//                 commission += (items.price * items.quantity) * 9.20 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
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
  
// }
// );



// Get all user 2 months ago order and Income -- seller
// router.get("/get/previos/four/weeks/userOrder", sellerverifyToken, async (req, res) => {
//   const seller = await Seller.findById(req.seller.id);
//   if (!seller) {
//     return res.status(400).json("Seller not found")
//   }
//   const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
//   if (!orders) {
//     return res.status(200).json("You don't have any order");
//   };
//   let datefor = new Date(seller.startAt);
//   // let joinUpdate = new Date(seller.startAt);
//   let PreviousPaymentdAt = new Date(seller.paymentDateAt);
//   let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 28));
//   let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 28));
//   let now = new Date();

//   let orderItems;
//   let Sales = 0;
//   let Amount = 0;
//   let commission = 0;

//   const orderall = await Promise.all(
//     orders.map((order) => {
//       if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
//         if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
//           if (order.orderStatus == "Delivered") {
//             orderItems = order.orderItems;
//             orderItems.map((items) => {
//               Sales += items.price * items.quantity;
//               if (items.subcategories == "Women's Fashion") {
//                 commission += (items.price * items.quantity) * 10.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//               }
//               else if (items.subcategories == "Casual Shirts") {
//                 commission += (items.price * items.quantity) * 9.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//               }
//               else if (items.subcategories == "T-Shirts") {
//                 commission += (items.price * items.quantity) * 9.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//               }
//               else if (items.subcategories == "Books") {
//                 commission += (items.price * items.quantity) * 8.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//               }
//               else if (items.subcategories == "Beauty and Personal Care") {
//                 commission += (items.price * items.quantity) * 9.20 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
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
  
// }
// );



// Get all user 1 month ago order and Income -- seller
// router.get("/get/previos/one/month/userOrder", sellerverifyToken, async (req, res) => {
//   const seller = await Seller.findById(req.seller.id);
//   if (!seller) {
//     return res.status(400).json("Seller not found")
//   }
//   const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });
//   if (!orders) {
//     return res.status(200).json("You don't have any order");
//   };
//   let datefor = new Date(seller.startAt);
//   // let joinUpdate = new Date(seller.startAt);
//   let PreviousPaymentdAt = new Date(seller.paymentDateAt);
//   let startatForPrev = new Date(datefor.setDate(datefor.getDate() - 28));
//   let paymentDateAt = new Date(PreviousPaymentdAt.setDate(PreviousPaymentdAt.getDate() - 28));
//   let now = new Date();

//   let orderItems;
//   let Sales = 0;
//   let Amount = 0;
//   let commission = 0;

//   const orderall = await Promise.all(
//     orders.map((order) => {
//       if (order.createdAt >= startatForPrev || order.deliveredAt >= startatForPrev) {
//         if (order.createdAt <= paymentDateAt || order.deliveredAt <= paymentDateAt) {
//           if (order.orderStatus == "Delivered") {
//             orderItems = order.orderItems;
//             orderItems.map((items) => {
//               Sales += items.price * items.quantity;
//               if (items.subcategories == "Women's Fashion") {
//                 commission += (items.price * items.quantity) * 10.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//               }
//               else if (items.subcategories == "Casual Shirts") {
//                 commission += (items.price * items.quantity) * 9.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//               }
//               else if (items.subcategories == "T-Shirts") {
//                 commission += (items.price * items.quantity) * 9.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 9.2 / 100;
//               }
//               else if (items.subcategories == "Books") {
//                 commission += (items.price * items.quantity) * 8.2 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 13.2 / 100;
//               }
//               else if (items.subcategories == "Beauty and Personal Care") {
//                 commission += (items.price * items.quantity) * 9.20 / 100;
//                 Amount += items.price * items.quantity - (items.price * items.quantity) * 10.20 / 100;
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
  
// }
// );



// Get all user order and return order -- seller
router.get("/get/return/userOrder", sellerverifyToken, async (req, res) => {
  try {
  const seller = await Seller.findById(req.seller.id);
  if (!seller) {
    console.log("something is wrong")
  }
  // let Startat = new Date(seller.startAt);
  let paymentDateAt = new Date(seller.paymentDateAt);
  const orders = await Order.find({ orderItems: { $elemMatch: { seller: req.seller.id } } });

  const orderall = await Promise.all(
    orders.map((order) => {
      // console.log(order === "Return Proccessing")
      // if (order.createdAt >= Startat) {
        // if (order.createdAt <= paymentDateAt) {
          if (order.orderStatus == "Return processing" || order.orderStatus == "Return completed") {
            return order;
          };
        // }
      // }
    })
  )

  
  
  
  let items = orderall.filter(x => x !== undefined);
  let itemss = await Promise.all(items.map(async subitem => {
    let orderItem = await Promise.all(subitem.orderItems.map(async undersubitem => {
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
      return undersubitem;
    }))
    // Flatten the array of orderItems down to a single level
    subitem.orderItems = orderItem.flat();
    return subitem;
  }));
  console.log(itemss , "This is only for testing")
  res.status(200).json({ success: true, itemss });
      
} catch (error) {
    
}
});


// Get all user order and return order -- Influencer
router.get("/get/affid/return/userOrder", verifyToken, async (req, res) => {
  try{
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(400).json("user is not found")
  }
  let Startat = new Date(user?.startAt);
  let paymentDateAt = new Date(user?.paymentDateAt);

  console.log(Startat);
  console.log(paymentDateAt)
  const orders = await Order.find({ orderItems: { $elemMatch: { affid: req.user.id } } });

  const orderall = await Promise.all(
    orders.map((order) => {
      // console.log(order === "Return Proccessing")
      if (order.createdAt >= Startat) {
        console.log("One layer")
        if (order.createdAt <= paymentDateAt) {
          console.log("two layer")
          if (order.orderStatus == "Return processing") {
            return order;
          };
        }
      }
    })
  )

  let items = orderall.filter(x => x !== undefined);
  res.status(200).json({ success: true, items });
      
} catch (error) {
    return res.status(500).json("Internal error occured")
}
});



router.get("/get/return/userOrders", verifyToken, async (req, res) => {
  try {
    const nowDate = new Date();
    const lastMonth = new Date(nowDate.setDate(nowDate.getDate()));
  const previousMonth = new Date(new Date().setDate(lastMonth.getDate() - 30));
  const orders = await Order.find({ user: req.user.id });
  console.log(lastMonth);
  console.log(previousMonth);
  
  
  const orderall = await Promise.all(
    orders.map((order) => {
      
      if (order.createdAt >= previousMonth) {
        if (order.createdAt <= lastMonth) {
          if (order.orderStatus == "Return Proccessing" || order.orderStatus == "Return Complete") {
            return order;
          };
        }
      }
    })
    )
    
    let items = orderall.filter(x => x !== undefined);
    res.status(200).json({ success: true, items });
    
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
});



// update Order status -- Seller
router.put("/update/status/:id", async (req, res) => {
  try {
  const orders = await Order.findById(req.params.id);
  // if (orders.orderStatus === "Delivered") {
  //   return res.status(400).json("You have already delivered this order");
  // }
  orders.orderItems.forEach(async (order) => {
    await updateStock(order._id, order.quantity);
  });
  orders.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    orders.deliveredAt = Date.now();
  }
  await orders.save({ validatorBeforeSave: false });

  res.status(200).json({ success: true, msg:"Your OrderStatus has been change successfully" });

  } catch (error) {
      return res.status(500).json("Internal server error")
  }
});
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({ validatorBeforeSave: false });
}


router.put("/return/order/update/status/:id", verifyToken, async (req, res) => {
  try {
  const orders = await Order.findById(req.params.id);
  orders.orderStatus = req.body.status;
  orders.return_order_reason = req.body.return_order_reason
  if (req.body.status === "Return proccessing") {
    orders.returnAt = Date.now();
  }
  await orders.save({ validatorBeforeSave: false });

  res.status(200).json({ success: true, orders });    
} catch (error) {
    return res.status(500).json("Internal error occured")
}
});

module.exports = router;
