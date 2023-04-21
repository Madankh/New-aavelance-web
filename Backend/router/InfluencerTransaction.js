const router = require("express").Router();
const UserTransaction = require("../models/InfluencerTransaction");
const { mainAdminverifyTokenAndAdmin, mainAdminverifyToken } = require("./mainAdminverify");
const { InfluencerverifyToken } = require("./InfluencerverifyToken");
const { verifyToken } = require("./verifyToken");
const User = require("../models/User");


//Create transactions
router.post("/user/money", verifyToken, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user){
        res.status(400).json("Something is wrong");
    };
    console.log(user?._id)
    if(user.paymentPendingDate <= Date.now()){
        const { status, amount , Sales , user} = req.body;
        let moneyTransfer = new UserTransaction({amoun, Sales , status , user});
        try {
            const saveTransfer = await moneyTransfer.save();
            res.status(200).json(saveTransfer);
            
        } catch (error) {
            return res.status(500).json("Some error occure");
        }
    }else{
        return res.status(400).json("Payment time is not match")
    }
    
})

// router.post("/influencer/money", InfluencerverifyToken, async (req, res) => {
//     const influencer = await Influencer.findById(req.influencer.id);
//     if (!influencer) {
//         res.status(400).json("Something is wrong");
//     };
//     // console.log(influencer.paymentPendingDate)
//     // if(influencer.paymentPendingDate <= Date.now()){
//         const { status, amount} = req.body;
//         let moneyTransfer = new Transfermoney({
//             amount , status , seller: req.seller.id
//         });
//         try {
//             const saveTransfer = await moneyTransfer.save();
//             res.status(200).json(saveTransfer);
//             let paymentPendingDate = new Date(influencer?.paymentPendingDate);
//             const Month = new Date(paymentPendingDate.setDate(paymentPendingDate.getDate() + 7));
//             const updateinfluencer = await Influencer.findByIdAndUpdate(req.influencer.id, {
//                 "paymentPendingDate": Month
//             });
//         } catch (error) {
//             res.status(500).json("Some error occure");
//         }
//     // }else{
//     //     res.status(400).json("Payment time is not match")
//     // }
// })

//Update money tranfer
router.put("/money/status/:id", mainAdminverifyTokenAndAdmin, async (req, res) => {
    try {
        const updateTransfer = await UserTransaction.findByIdAndUpdate(req.params.id, {
            $set: req.body
        })
        await updateTransfer.save();
        res.status(200).json("You payment is paid successfully")
    } catch (error) {
        return res.status(500).json("Internal error occured")
    }
})

//Get pending Transaction
router.get("/get/transaction", verifyToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.find({ user: req.user.id });
        if (!transaction) {
            return res.status(404).json("You Don't Have Any Transaction right now");
        }
        
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status == "Pending"){
                console.log(item)
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

//Get pending Transaction
router.get("/get/transaction/:id", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.find({ user: req.params.id });
        if (!transaction) {
            return res.status(404).json("You Don't Have Any Transaction right now");
        }
        
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status == "Pending"){
                console.log(item)
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


//Get pending Transaction ---- For MainAdmin
router.get("/transaction/for/mainAdmin", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.find();
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
router.get("/Complected/transaction/for/mainAdmin", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.find();
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


//Get pending Transaction ---- For MainAdmin
router.get("/Com/transaction/for/mainAdmin", mainAdminverifyToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.find();
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
router.get("/get/status/complected/transaction", verifyToken, async (req, res) => {
    try {
        const transaction = await UserTransaction.find({ user: req.user.id });
        if (!transaction) {
            return res.status(404).json("You Don't Have Any Transaction right now");
        }
        
        const pendingTransaction = await Promise.all(transaction.map((item)=>{
            if(item.status === "Completed"){
                console.log(item)
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



module.exports = router;