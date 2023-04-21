const jwt = require("jsonwebtoken");

const mainAdminverifyToken = (req , res , next)=>{ ///To verify Admin with it jwt token
        const authHeader = req.headers.token
        if(authHeader){
            const token = authHeader 
            jwt.verify(token ,process.env.ADMIN_SEC, (err , mainadmin)=>{ //JWT token verify with JWT_SEC
                if(err) return res.status(403).json("Admin Token is not valid");
                req.mainadmin = mainadmin;
                next();
            })
        }else{
            return res.status(401).json("You are not authenticated!")
        } 
}


const mainAdminverifyTokenAndAuthorization = (req , res , next) =>{ ///To check req.user and params user are same if yes user is isAdmin or not if yes than process to do other things 
        mainAdminverifyToken(req , res, ()=>{ //This is jwt token
            if(req.mainadmin.id === req.params.id || req.body.isMainAdmin){ //user and params and isAdmin are same or not if they are same than process it.
                next();
            }else{
                return res.status(403).json("You are not allowed to do this")
            }
        })
    }
    
const mainAdminverifyTokenAndAdmin = (req , res , next)=>{
        mainAdminverifyToken(req , res,()=>{
            if(req.mainadmin.isMainAdmin){
                next();
            } else{
                return res.status(403).json("You are not allowed to do that!")
            }
        });
};
 

module.exports = {mainAdminverifyToken , mainAdminverifyTokenAndAuthorization , mainAdminverifyTokenAndAdmin}


