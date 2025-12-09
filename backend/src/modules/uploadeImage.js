const mongoose = require("mongoose");

const schema = mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    description : {
        type: String,
        require : true,
    },
    file : {
        type: String,
        require : true,
    }
})

const uploadeImage = mongoose.model("uploadeImage",schema);

module.exports = uploadeImage;
