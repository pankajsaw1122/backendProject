const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
var multer = require('multer');
const path = require('path');
var fs = require('fs');
var func = require('./../commonfunction');
var sendResponse = require('./../sendresponse');

// Load image model
require('../../models/uploads/userimage');
const userImageCollection = mongoose.model('profile_image');

// provide image path nand name
const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage
}).single('profileImage');

// Api call
router.post('/uploadImage', (req, res) => {
    // upload image
    upload(req, res, (err) => {
        if (err) {
            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
        } else {
            // check file received or not
            if (req.file === undefined) {
                sendResponse.sendErrorMessage('Some Parameter Missing', res);
            } else {
                const imageName = req.file.destination + req.file.filename; // create image name
                var uplaodData = {
                    upload_path: imageName
                };
                // save data to collection
                new userImageCollection(uplaodData).save().then(profile_image => {
                    console.log('image uploaded');
                    let data = {
                        imageId: profile_image._id,
                        imagePath: profile_image.upload_path
                    };
                    sendResponse.sendSuccessData(data, res); // send response to client pc
                }).catch(function (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res);                  
                });
            }
        }
    });
});

module.exports = router;