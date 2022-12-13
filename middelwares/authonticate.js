const jwt  = require("jsonwebtoken");
require('dotenv').config();
const authenticate  = (req,res,next)=>{
    const token = req.headers?.authorization?.split(" ")[1];
    if(token){
        const decoded =jwt.verify(token,process.env.secret_key);
        if(decoded){
            const userID = decoded.userID;
            req.body.userID = userID
            next()
        }else{
            res.send("something went worng please login")
        }
    }else{
        res.send({"msg":"please login"})
    }
}


module.exports = {authenticate}