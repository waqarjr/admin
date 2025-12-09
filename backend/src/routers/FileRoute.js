const express = require("express");
const multerfile = require("../lib/multerfile");

const { filesUploading ,filesFetching} = require("../controllers/Filecontrol");
const router = express.Router();

router.post("/files", multerfile("images/webp","file"),filesUploading);

router.get("/files",filesFetching)



module.exports = router;