const jwt = require("jsonwebtoken");

 const generateToken = (user,res) => {
try{
    const token = jwt.sign({username : user}, process.env.ADMIN_SECRET_KEY, {expiresIn : "7d"});
    res.cookie("Admin_Token", token,{
            maxAge: 7 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict', 
            secure: process.env.NODE_ENV === 'production' 
        }) 
        return token;
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

const clearToken = (res) => {
    res.clearCookie("Admin_Token");
    return true;
}

module.exports = { generateToken , verifyToken , clearToken };