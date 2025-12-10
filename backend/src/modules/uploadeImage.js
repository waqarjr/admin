const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type: String,
        required : true,
    },
    file : {
        type: String,
        required : true,
    },
    latitude : {
        type : Number,
        required : true
    },
    longitude : {
        type : Number,
        required : true
    }
});

const uploadeImage = mongoose.model("uploadeImage", schema);

module.exports = uploadeImage;
