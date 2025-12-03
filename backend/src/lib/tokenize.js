const jwt = require("jsonwebtoken");

 const generateToken = (user,res) => {
try{
    const token = jwt.sign({user}, process.env.ADMIN_SECRET_KEY, {expiresIn : "1h"});
    res.json({success : true ,message:"Your Data Have Been Updated",data:{token : token}},{status:200})
}catch(err){
    res.json({success : false ,message:"Something went wrong",data:null},{status:500})
}
}

 const verifyToken = (token) => {
    try{
        return jwt.verify(token, process.env.ADMIN_SECRET_KEY);
    }catch(err){
        return null;
    }
}

module.exports = { generateToken , verifyToken };