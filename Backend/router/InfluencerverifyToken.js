const jwt = require("jsonwebtoken");

const InfluencerverifyToken = (req , res , next)=>{ ///To verify user with it jwt token

        const authHeader = req.headers.token
        if(authHeader){
            const token = authHeader 
            jwt.verify(token , process.env.INFLU , (err , influencer)=>{ //JWT token verify with JWT_SEC
                if(err) return res.status(403).json("Influencer Token is not valid");
                req.influencer = influencer;
                next();
            })
        }else{
            return res.status(401).json("You are not authenticated!")
        }     
}

const influencerverifyTokenAndAuthorization = (req , res , next) =>{ ///To check req.user and params user are same if yes user is isAdmin or not if yes than process to do other things 
    InfluencerverifyToken(req, res, () => { //This is jwt token
            if (req.influencer.id === req.params.id) {
                next();
            } else {
                return res.status(403).json("You are not allowed to do this")
            }
        })
}
    
 

module.exports = {InfluencerverifyToken , influencerverifyTokenAndAuthorization }


