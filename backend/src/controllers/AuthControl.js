const bcrypt = require("bcryptjs");
const { generateToken, clearToken } = require("../lib/tokenize");

const login = async (req, res) => {
    const AuthuserName ="waqarahmad";
    const Authpassword ="$2b$10$2czrBpDfDw.lZchwr3BhbunDuMmVDgPTRS5kP9OqVb4cRmfieffWC";

    try{
        const {username , password } = req.body;
        if(!username || !password){
            return res.json({success : false ,message:"All fields are required",data:null},{status:400})
        }
        const comparePassword = await bcrypt.compare(password, Authpassword);
        if(username === AuthuserName && comparePassword){
            const token =  generateToken(username,res);
            return res.json({success : true ,message:"Your Data Have Been Updated",data:{token : token}},{status:200})  
        }
        return res.status(400).json({success : false ,message:"Invalid credentials",data:null},{status:400})
    }catch(err){
        console.log(err.name);
        res.json({success : false ,message:"Something went wrong",data:null},{status:500})
    }
};

const logout = (req,res)=>{
    const clear = clearToken(res);
    if(clear){
        return res.json({success : true ,message:"Your Data Have Been Updated",data:null},{status:200})  
    }
}

module.exports = { login , logout }; 
