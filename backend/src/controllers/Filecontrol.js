const uploadeImage = require("../modules/uploadeImage");

const filesUploading = async (req,res)=>{
  try {
    await uploadeImage.create({ 
        name : req.body.name,
        description : req.body.description,
        file : `http://localhost:2000/${req.file.path}`,
    })
    return res.status(200).json({success : true ,message:"File uploaded successfully !",data:null})
  } catch (error) {
    return res.status(500).json({success : false ,message:"Something went wrong",data:null}) 
  }
}

const filesFetching = async (req,res)=>{
    try {
        const files = await uploadeImage.find()
        console.log(files);
        return res.status(200).json({success : true ,message:"Data fetch successfully !",data:files})
    } catch (error) {
        return res.status(500).json({success : false ,message:"Something went wrong",data:null}) 
    }
}

module.exports = { filesUploading ,filesFetching };