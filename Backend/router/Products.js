const router = require("express").Router();
const Product = require("..//models/Product");
const { mainAdminverifyToken } = require("./mainAdminverify");
const { sellerverifyToken } = require("./SellerverifyToken");
const { verifyToken } = require("./verifyToken");


const crypto  = require("crypto")
const multer = require('multer')
const storage = multer.memoryStorage()
const sharp = require('sharp');
const dotenv = require("dotenv");
const { S3Client, PutObjectCommand, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const upload = multer({ storage: storage })

const randomfileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')
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

//Create Product
router.post("/product", upload.fields([
    { name: 'img', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ]), sellerverifyToken, async (req, res) => {
    try {

        const processedImages = await Promise.all(req.files.img.map(async image => {
            const fileBuffer = await sharp(image.buffer)
                .jpeg({ quality: 40 })
                .toBuffer();
                const imageName = randomfileName();
                const params = {
                  Bucket: bucketNAME,
                  Key: imageName,
                  Body: fileBuffer,
                  ContentType: image.mimetype,
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);
            return imageName; // return the image name for use in the Product document
        }));



        const { title, desc, productDetail , imgKey, Liquid_Type ,
             categories, subcategories, Publisher, color, Language, Item_Weight,
            brand, price, Stock, Material,
            Product_Dimensions, Fabric, Skin_Tone, Age_Range, Product_Benefits, Material_Type_Free,
            Manufacturer, ASIN, Item_model_number, size, Scent, Liquid_Volume, Country_of_origin,
            Top_Type, Texture,
            Strap_Material, Hair_Type, Hair_Concerns, Hair_Care_Benefits,
            Model, Packer, Sole_Material, Date_First_Available } = req.body;



        let newproduct = new Product({
            title, desc, productDetail, Liquid_Type ,
            video : "", img:processedImages, imgKey:processedImages , categories, subcategories, Publisher, color, Language, Item_Weight,
            brand, price, Stock, Material,
            Product_Dimensions, Fabric, Skin_Tone, Age_Range, Product_Benefits, Material_Type_Free,
            Manufacturer, ASIN, Item_model_number, size, Scent, Liquid_Volume, Country_of_origin,
            Top_Type, Texture,
            Strap_Material, Hair_Type, Hair_Concerns, Hair_Care_Benefits,
            Model, Packer, Sole_Material, Date_First_Available, seller: req.seller.id
        });
        // try {
        const saveProduct = await newproduct.save();
        return res.status(200).json("You successfully upload your product");
        // }
        //  catch (error) {
        //     return res.status(400).json("Some error occure");
        // } 

    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})

//Update Product
router.put("/:id", upload.fields([
    { name: 'img', maxCount: 10 },
    { name: 'video', maxCount: 1 },
  ]), sellerverifyToken, async (req, res) => {
    try {
        let updateProduct = await Product.findById(req.params.id);
        if (!updateProduct) { return res.status(401).json("not found") }

        const processedImages = await Promise.all(req.files.img.map(async image => {
            const fileBuffer = await sharp(image.buffer)
                .jpeg({ quality: 40 })
                .toBuffer();
                const imageName = randomfileName();
                const params = {
                  Bucket: bucketNAME,
                  Key: imageName,
                  Body: fileBuffer,
                  ContentType: image.mimetype,
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);
            return imageName; // return the image name for use in the Product document
        }));

        req.body.img = processedImages;
        updateProduct = await Product.findByIdAndUpdate(
            req.params.id, {
            $set: req.body
        }, { new: true })

        res.json("Your product is successfully updated");

    } catch (error) {
        return res.status(500).json("Internal error occur")
    }
})


//Delete product
router.delete("/:id", sellerverifyToken, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) { return res.status(404).json("Not found"); }

        if (product.seller.toString() !== req.seller.id) {
            return res.status(401).json("Product is not found")
        }

        product = await Product.findByIdAndDelete(req.params.id)
        return res.json("Product is Deleted");

    } catch (error) {
        return res.status(500).json("Internal error occur")
    }
})

// Get a product
router.get("/find/:id", async (req, res) => {
    try {
        const qNew = req.query.affid;
        const findproduct = await Product.findById(req.params.id);

        const images = await Promise.all(findproduct.img.map(async imageKey => {
            // Create a GetObjectCommand with the necessary parameters
            const command = new GetObjectCommand({
              Bucket: bucketNAME,
              Key: imageKey,
            });
            const url = await getSignedUrl(s3, command);
            return url;
          }));

        findproduct.img = images;
        res.status(200).json(findproduct)
    } catch (error) {
        return res.status(500).json("Internal error ocurred")
    }
})

// All product upload by Seller
router.get("/allpro", sellerverifyToken, async (req, res) => {
    try {
        const product = await Product.find({ seller: req.seller.id });
        const products = await Promise.all(product.map(async(item)=>{
           
            const images = await Promise.all(item.img.map(async imageKey => {
              // Create a GetObjectCommand with the necessary parameters
              const command = new GetObjectCommand({
                Bucket: bucketNAME,
                Key: imageKey,
              });
              // Get the signed URL for the image
              const url = await getSignedUrl(s3, command);
              return url;
            }));
            // console.log(images , "Images")
            item.img = images
            return item;
        }))
        
        res.json(products);
    } catch (error) {
        return res.status(400).json("Internal Error occured")
    }
});

// All product upload by Seller for profile
router.get("/allproduct/:id", async (req, res) => {
    try {
        const product = await Product.find({ seller: req.params.id });
        const products = await Promise.all(product.map(async(item)=>{
           
            const images = await Promise.all(item.img.map(async imageKey => {
              // Create a GetObjectCommand with the necessary parameters
              const command = new GetObjectCommand({
                Bucket: bucketNAME,
                Key: imageKey,
              });
              // Get the signed URL for the image
              const url = await getSignedUrl(s3, command);
              return url;
            }));
            // console.log(images , "Images")
            item.img = images
            return item;
        }))

        res.json(products);
    } catch (error) {
        return res.status(500).json("Internal Error occured")
    }
});

///Get Product for profile page 
router.get("/timeline/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
});

// Get all Product for User with it's Category
router.get("/getallProduct", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qsubCategory = req.query.subcategories;
    const qtitle = req.query.search_query;
    const qprice = req.query.price;
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(10)
        }
        else if (qCategory && qsubCategory) {
            products = await Product.find({ categories: { $in: [qCategory] }, subcategories: { $in: [qsubCategory] } })
        } else if (qCategory) {
            products = await Product.find({
                categories: { $in: [qCategory], },
            })
        }
        else if (qsubCategory) {
            products = await Product.find({
                subcategories: {
                    $in: [qsubCategory],
                },
            });
        } else if (qtitle) {
            products = await Product.find({
                title: {
                    $regex: qtitle,
                    $options: 'i'
                }
            });
        }
        else if (qprice) {
            products = await Product.find({
                price: {
                    $in: [qprice]
                }
            })
        }
        else {
            products = await Product.find();
        }

        const product = await Promise.all(products.map(async(item)=>{
           
              const images = await Promise.all(item.img.map(async imageKey => {
                // Create a GetObjectCommand with the necessary parameters
                const command = new GetObjectCommand({
                  Bucket: bucketNAME,
                  Key: imageKey,
                });
                // Get the signed URL for the image
                const url = await getSignedUrl(s3, command);
                return url;
              }));
              // console.log(images , "Images")
              item.img = images
              return item;
          }))
        
        res.status(200).json(product)
    } catch (error) {
        return res.status(500).json("Internal error occure")
    }
})




// Create new review or update the review
router.put("/reviews/product", verifyToken, async (req, res) => {
    try {
        const { rating, comment, productid } = req.body;
        const review = {
            user: req.user.id,
            username:req.user.username,
            rating: Number(rating),
            comment,
        }
        console.log(req.user.username);
        
        const product = await Product.findById(productid);

        const isReviewed = product.reviews.find(
            (productreview) => productreview.user.toString() === req.user.id.toString());

        if (isReviewed) {
            product.reviews.forEach((productreview) => {
                if (productreview.user.toString() == req.user.id.toString()) {
                    (productreview.rating = rating), (productreview.comment = comment);

                }
            });
        } else {
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length
        }

        let avg = 0;
        product.reviews.forEach((productreview) => {
            avg += productreview.rating;
        })
        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        return res.status(500).json("Internal server error")
    }
});

//Get all Reviews Of a Product
router.get("/get/product/reviews", async (req, res) => {
    try {
        const product = await Product.findById(req.query.id);

        if (!product) {
            return res.status(404).json("Product not found");
        }
        res.status(200).json({
            success: true,
            reviews: product.reviews
        })

    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})


// All product upload by Seller for profile
router.get("/all/product/:id", mainAdminverifyToken, async (req, res) => {
    try {
        const product = await Product.find({ seller: req.params.id });
        const products = await Promise.all(product.map(async(item)=>{
           
            const images = await Promise.all(item.img.map(async imageKey => {
              // Create a GetObjectCommand with the necessary parameters
              const command = new GetObjectCommand({
                Bucket: bucketNAME,
                Key: imageKey,
              });
              // Get the signed URL for the image
              const url = await getSignedUrl(s3, command);
              return url;
            }));
            // console.log(images , "Images")
            item.img = images
            return item;
        }))

        
        res.status(200).json(products);
    } catch (error) {
        return res.status(200).json("Internal Error occured")
    }
});





module.exports = router;