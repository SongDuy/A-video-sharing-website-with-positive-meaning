const multer = require('multer');
const path = require('path');
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".mp4" && ext !== ".mkv" && ext !== ".jpeg" && ext !== ".jpg" && ext !== ".png") {
            return cb(new Error('Only.mp4 files are allowed!'), false);
        }
        cb(null, true);
    }
})