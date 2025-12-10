const express = require("express");
const multerfile = require("../lib/multerfile");

const { filesUploading ,filesFetching,filesDataGet,filesDataUpdate} = require("../controllers/Filecontrol");
const router = express.Router();

router.post("/files", multerfile("images","file"),filesUploading)
.get("/files",filesFetching)
.get("/files/:id",filesDataGet)
.put("/files/:id", multerfile("images","file"),filesDataUpdate)


module.exports = router;