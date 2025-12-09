const express = require("express");
const multerfile = require("../lib/multerfile");

const { filesUploading ,filesFetching,filesDataGet,filesDataUpdate} = require("../controllers/Filecontrol");
const router = express.Router();

router.post("/files", multerfile("images/webp","file"),filesUploading)
.get("/files",filesFetching)
.get("/files/:id",filesDataGet)
.put("/files/:id", multerfile("images/webp","file"),filesDataUpdate)

module.exports = router;