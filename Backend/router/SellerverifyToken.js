const jwt = require("jsonwebtoken");
const sellerverifyToken = (req , res , next)=>{ ///To verify user with it jwt token

        const authHeader = req.headers.token
        if(authHeader){
            const token = authHeader 
            jwt.verify(token , process.env.SELL_SEC , (err , seller)=>{ //JWT token verify with JWT_SEC
                if(err)return res.status(403).json("Seller Token is not valid");
                req.seller = seller;
                next();
            })
        }else{
            return res.status(401).json("You are not authenticated!")
        }      
}

const SellerverifyTokenAndAuthorization = (req , res , next) =>{ ///To check req.user and params user are same if yes user is isAdmin or not if yes than process to do other things 
        sellerverifyToken(req, res, () => { //This is jwt token
            if (req.seller.id === req.params.id || req.body.isSeller) { //user and params and isAdmin are same or not if they are same than process it.
                next();
            } else {
                return res.status(403).json("You are not allowed to do this")
            }
        })
}
    const sellerverifyTokenAndAdmin = (req , res , next)=>{
            sellerverifyToken(req , res,()=>{
                if(req.seller.isSuppliers){
                    next();
                } else{
                    return res.status(403).json("You are not allowed to do that!")
                }
            });
};
 

module.exports = {sellerverifyToken , SellerverifyTokenAndAuthorization , sellerverifyTokenAndAdmin}


