const router = require("express").Router();
const PendingSellerMoney = require("../models/Pendingsellermoney");
const Seller = require("../models/Seller");
const { mainAdminverifyTokenAndAdmin, mainAdminverifyToken } = require("./mainAdminverify");
const { sellerverifyToken } = require("./SellerverifyToken");



router.post("/money", sellerverifyToken, async (req, res) => {
    try {

    const seller = await Seller.findById(req.seller.id);
    if (!seller){
        res.status(400).json("Something is wrong");
    };
    if(seller.paymentPendingDate <= Date.now()){
        const { status, amount , seller} = req.body;
        let moneyTransfer = new PendingSellerMoney({
            amount , status , seller
        });
        try {
            const saveTransfer = await moneyTransfer.save();
            res.status(200).json(saveTransfer);
            
            let paymentPendingDate = new Date(seller?.paymentPendingDate);
            const Month = new Date(paymentPendingDate.setDate(paymentPendingDate.getDate() + 7));
            console.log(Month);
            const updateuser = await Seller.findByIdAndUpdate(req.seller.id, {
                "paymentPendingDate": Month
              });
        } catch (error) {
            res.status(500).json("Some error occure");
        }
    }else{
        res.status(400).json("Payment time is not match")
    }           
} catch (error) {
     return res.status(500).json("Internal error")   
}
})

// router.post("/influencer/money", InfluencerverifyToken, async (req, res) => {
//     const influencer = await Influencer.findById(req.influencerl.id);
//     if (!influencer) {
//         res.status(400).json("Something is wrong");
//     };
//     if(influencer.paymentPendingDate <= Date.now()){
//         const { status, amount} = req.body;
//         let moneyTransfer = new Transfermoney({
//             amount , status , seller: req.seller.id
//         });
//         try {
//             const saveTransfer = await moneyTransfer.save();
//             res.status(200).json(saveTransfer);
            
//             let paymentPendingDate = new Date(seller?.paymentPendingDate);
//             const Month = new Date(paymentPendingDate.setDate(paymentPendingDate.getDate() + 7));
//             const updateuser = await Influencer.findByIdAndUpdate(req.influencer.id, {
//                 "paymentPendingDate": Month
//               });
//         } catch (error) {
//             res.status(500).json("Some error occure");
//         }
        
//     }else{
//         res.status(400).json("Payment time is not match")
//     }
    
// })

// //Update money tranfer
router.put("/money/status/:id", mainAdminverifyTokenAndAdmin, async (req, res) => {
    try {
        const updateTransfer = await PendingSellerMoney.findByIdAndUpdate(req.params.id, {
            $set: req.body
        })
        await updateTransfer.save();
        res.status(200).json(updateTransfer)
    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})

//Get pending Transaction --- seller
router.get("/get/transaction", sellerverifyToken, async (req, res) => {
    try {
        const transaction = await PendingSellerMoney.find({ seller: req.seller.id }).sort({$natural:-1});;
        if (!transaction) {
            res.status(404).json("You Don't Have Any Transaction Right Now");
        }
        
        // let ma = [];
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status === "Pending"){
                return item;
            }
        }))
        let items = pendingTransaction.filter(x => x !== undefined);
        res.status(200).json(items)
        // }
    } catch (error) {
        return res.status(500).json("Internal error occured");
    }

})


//Get pending Transaction --- seller
router.get("/get/main/transaction/:id", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await PendingSellerMoney.find({ seller: req.params.id }).sort({$natural:-1});;
        if (!transaction) {
            res.status(404).json("You Don't Have Any Transaction Right Now");
        } 
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status === "Pending"){
                return item;
            }
        }))
        const filterPendingTransaction = pendingTransaction.filter(x => x !== undefined)
        res.status(200).json(filterPendingTransaction)
    } catch (error) {
        return res.status(500).json("Internal error occured");
    }

})


//Get pending Transaction ---- For MainAdmin
router.get("/transaction/for/mainAdmin", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await PendingSellerMoney.find();
        if (!transaction) {
            res.status(404).json("You Don't Have Any Transaction Right Now");
        }
        
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status === "Pending"){
                return item;
            }
        }))
        const filterPendingTransaction = pendingTransaction.filter(x => x !== undefined)
        console.log(filterPendingTransaction)
        res.status(200).json(filterPendingTransaction)
    } catch (error) {
        return res.status(500).json("Internal error occured");
    }

})

//Get pending Transaction ---- For MainAdmin
router.get("/completed/transaction/for/mainAdmin", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await PendingSellerMoney.find();
        if (!transaction) {
            res.status(404).json("You Don't Have Any Transaction Right Now");
        }
        
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status === "Complected"){
                return item;
            }
        }))
        const filterPendingTransaction = pendingTransaction.filter(x => x !== undefined)
        console.log(filterPendingTransaction)
        res.status(200).json(filterPendingTransaction)
    } catch (error) {
        return res.status(500).json("Internal error occured");
    }

})





//Get complected Transaction
router.get("/get/status/complected/transaction", sellerverifyToken, async (req, res) => {
    try {
        const Transaction = await PendingSellerMoney.find({ seller: req.seller.id }).sort({$natural:-1});;
        if (!Transaction) {
            res.status(404).json("You Don't Have Any Transaction Right Now");
        } else {

            const ComplectedTransaction = await Promise.all(Transaction.map((item)=>{
                if(item.status === "Complected"){
                    return item;
                }
            }))
            let items = ComplectedTransaction.filter(x => x !== undefined);
                res.status(200).json(items);
        }
    } catch (error) {
        return res.status(500).json("Internal error occured");
    }

})






module.exports = router;