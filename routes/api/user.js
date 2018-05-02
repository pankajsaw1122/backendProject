const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const async = require('async');
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var func = require('./../commonfunction');
var sendResponse = require('./../sendresponse');

// Load user model
require('../../models/users/user');
const userCollection = mongoose.model('user_data');

// Api to register user
router.post('/adduser', (req, res) => {
    console.log('add user request received');
    // Mandatory values check
    var manValues = [req.body.userName, req.body.userEmail, req.body.userPassword, req.body.contact];
    // call common functions
    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        },
        function (callback) {
            //  validate email
            func.checkEmailValidity(res, req.body.userEmail, callback);
        },
        function (callback) {
            // check if user allready registered
            func.checkEmailExistence(res, req.body.userEmail, callback);
        }
    ],
        function () {
            // encrypt password and prepare data
            bcrypt.hash(req.body.userPassword, 10, function (err, hash) {
                userDetail = {
                    user_name: req.body.userName,
                    email: req.body.userEmail,
                    password: hash,
                    contact: req.body.contact,
                    working_at: req.body.workingAt,
                    qualification: req.body.qualification,
                    studied_at: req.body.studiedAt,
                    lives_in: req.body.livesIn,
                    profileimage_id: req.body.profileImageId
                };
                // save user data to collection
                new userCollection(userDetail).save().then(user_data => {
                    console.log('add user request completed');

                    var fromEmail = 'educrafters.org@outlook.in';
                    var toEmail = req.body.userEmail;

                const transporter = require('../../models/email/emailCredential');
                transporter.sendMail({
                    from: fromEmail,
                    to: toEmail,
                    subject: 'Registrantion Confirmation',
                    text: 'Congratulation! Registration successfull',
                    html: '<p> Congratulation User you successfully registered with us. </p>'
                }, function (error, response) {
                    if (error) {
                        console.log('Failed in sending mail');
                        // console.dir({ success: false, existing: false, sendError: true });
                        console.dir(error);
                        // res.end('Failed in sending mail');
                    } else {
                        console.log('Successful in sending email');
                        //  console.dir({ success: true, existing: false, sendError: false });
                        // console.dir(response);
                        // res.end('Successful in sedning email');
                    }
                });
                    func.getProfileImagePath(user_data.profileimage_id, function (result) {
                        console.log(result);
                        let data = {
                            userId: user_data._id,
                            userName: user_data.user_name,
                            userEmail: user_data.email,
                            userContact: user_data.contact,
                            workingAt: user_data.working_at,
                            qualification: user_data.qualification,
                            studiedAt: user_data.studied_at,
                            livesIn: user_data.lives_in,
                            profileImage: result
                        };
                        sendResponse.sendSuccessData(data, res); // send successfull data submission response
                    })
                }).catch(function (err) {
                    console.log(err);
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                });
            })
        }
    )
});

// Api to login user with email and password
router.post('/userLogin', (req, res) => {
    // Mandatory values check    
    let manValues = [req.body.userEmail, req.body.userPassword];

    // call common functions   
    async.waterfall([
        function (callback) {
            // check empty values
            func.checkBlank(res, manValues, callback);
        },
        function (callback) {
            // check user is registered or not  
            func.checkEmailAvailibility(res, req.body.userEmail, callback);
        }
    ],
        function () {
            // find user detail by email-id
            userCollection.find({
                email: req.body.userEmail
            }).limit(1).exec(function (err, user_data) {
                if (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err msg if err in finding user                  
                } else {
                    // check password
                    const passwordcheck = bcrypt.compareSync(req.body.userPassword, user_data[0].password);
                    if (passwordcheck == true) {
                        let data = {
                            userName: user_data[0].user_name,
                            userEmail: user_data[0].email,
                            workingAt: user_data[0].working_at,
                            qualification: user_data[0].qualification,
                            studiedAt: user_data[0].studied_at,
                            livesIn: user_data[0].lives_in
                        };
                        sendResponse.sendSuccessData(data, res); // send user data to client
                    } else {
                        sendResponse.sendErrorMessage('Incorrect login credential', res);  // send err msg 
                    }
                }
            })
        }
    )
});

module.exports = router;