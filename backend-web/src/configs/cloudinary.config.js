const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'davybpzph',
    api_key: '875458816762412',
    api_secret: 'SZW_05tNJKxRmKKOkj7iJf4oDfQ'
});

module.exports = cloudinary;