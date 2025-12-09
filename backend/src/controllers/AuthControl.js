const adminLogin = require("../modules/loginModule");

const { generateToken } = require("../lib/tokenize");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log( username, password );

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await adminLogin.findOne({ username }).select("+password");
    
    if (!user) {
      return res.status(400).json({ success: false, message: "username not found " });
    }

    const matchPassword = await user.comparePassword(password);

    if (!matchPassword) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(user.username, res);
    return res.status(200).json({ success: true, message: "Login successful", data: { token }, });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const logout = (req,res)=>{
    // const clear = clearToken(res);
    // if(clear){
        return res.status(200).json({success : true ,message:"Your Data Have Been Updated",data:null})  
    // }
}

const dashboard = (req,res)=>{
    return res.status(200).json({success : true ,message:"Welcome to the dashboard page",data:req.user.username})
}




module.exports = { login, logout,dashboard }; 
 
