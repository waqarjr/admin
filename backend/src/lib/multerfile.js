// multerfile.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const multerfile = function(destination, fieldName) {
    
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
    }

    const storage = multer.memoryStorage();

    const upload = multer({ storage }).single(fieldName); 

    return function(req, res, next) {
        upload(req, res, async function(err) {
            
            if (err)  return next(err);

            if (!req.file) return next();
            
            try {
                const cleanName = req.file.originalname.replace(/[^a-zA-Z0-9.]/g, "").replace(/\s+/g, "");
                const nameWithoutExt = path.parse(cleanName).name;
                const webpFilename = Date.now() + "_" + nameWithoutExt + ".webp";
                const webpPath = path.join(destination, webpFilename);

                await sharp(req.file.buffer).webp({ quality: 80 }).toFile(webpPath);

                // console.log(webpFilename,webpPath,destination)
                req.file.filename = webpFilename;
                req.file.path = webpPath;
                req.file.mimetype = 'image/webp';
                req.file.destination = destination;

                next();
            } catch (error) {
                return next(error);
            }
        });
    };
};

module.exports = multerfile;