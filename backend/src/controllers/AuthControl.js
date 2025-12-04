const bcrypt = require("bcryptjs");
const adminLogin = require("../modules/loginModule");

const { generateToken, clearToken } = require("../lib/tokenize");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await adminLogin.findOne({ username }).select("+password");
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const matchPassword = await user.comparePassword(password);

    if (!matchPassword) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user.username, res);

    return res.status(200).json({ success: true, message: "Login successful", data: { token }, });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const logout = (req,res)=>{
    const clear = clearToken(res);
    if(clear){
        return res.status(200).json({success : true ,message:"Your Data Have Been Updated",data:null})  
    }
}



module.exports = { login , logout}; 
 
