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
        return res.status(200).json({success : true ,message:"Data fetch successfully !",data:files})
    } catch (error) {
        return res.status(500).json({success : false ,message:"Something went wrong",data:null}) 
    }
}

const filesDataGet= async (req,res)=>{
    try {
        const files = await uploadeImage.findById(req.params.id)
        return res.status(200).json({success : true ,message:"File updated successfully !",data:files})
    } catch (error) {
        return res.status(500).json({success : false ,message:"Something went wrong",data:null}) 
    }
}

const filesDataUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    
    const data = await uploadeImage.findById(id);
    
    if (!data) 
      return res.status(404).json({ success: false, message: "File not found",  data: null });
    
      
    if (req.file) {
      const oldFilePath = path.join(__dirname, '../', data.file.replace('http://localhost:2000/', ''));
      console.log(oldFilePath);
      
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      
      await uploadeImage.updateOne({ _id: id },
        { $set: {  name: name, file: `http://localhost:2000/${req.file.path}`, description: description } }
      );
      
    } else {
      await uploadeImage.updateOne({ _id: id },
        {  $set: {name: name, description: description} }
      );
    }
    
    const updatedData = await uploadeImage.findById(id);
    
    return res.status(200).json({ success: true, message: "File updated successfully!",data: updatedData});

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ success: false, message: error.message || "Something went wrong",  data: null });
  }
}

module.exports = { filesUploading ,filesFetching , filesDataGet,filesDataUpdate};