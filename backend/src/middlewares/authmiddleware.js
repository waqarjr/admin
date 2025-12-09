const jwt = require("jsonwebtoken");

const authmiddleware = async(req, res,next) => {

    const authHeader = req.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized",});
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const verifyToken = jwt.verify(token, process.env.ADMIN_SECRET_KEY);
        if(!verifyToken){
            return res.status(401).json({ success: false, message: "Invalid Token" });
        }
        req.user = verifyToken;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = authmiddleware;
