const jwt = require("jsonwebtoken");

const authmiddleware = (req, res,) => {

    const authHeader = req.headers.authorization;
   
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized",});
    }

    const token = authHeader.split(" ")[1]; 

    try {
        jwt.verify(token, process.env.ADMIN_SECRET_KEY);
        return res.status(200).json({ success: true, message: "Token is valid" });
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid Token" });
    }
};

module.exports = authmiddleware;
