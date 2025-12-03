const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../lib/tokenize");

const signupControl = async (req, res) => {
    const AuthuserName ="waqarahmad";
    const Authpassword ="$2b$10$2czrBpDfDw.lZchwr3BhbunDuMmVDgPTRS5kP9OqVb4cRmfieffWC";

    try{
        const {username , password } = req.body;
        if(!username || !password){
            return res.json({success : false ,message:"All fields are required",data:null},{status:400})
        }
        const comparePassword = await bcrypt.compare(password, Authpassword);
        if(username === AuthuserName && comparePassword){
            const hashedPassword = await bcrypt.hash(password, 10);
            generateToken(username,res);
            return res.json({success : true ,message:"Your Data Have Been Updated",data:{password : hashedPassword , token : token}},{status:200})  

        }
        return res.status(400).json({success : false ,message:"Invalid credentials",data:null},{status:400})
    }catch(err){
        console.log(err.name);
        res.json({success : false ,message:"Something went wrong",data:null},{status:500})
    }
};

module.exports = { signupControl }; 
