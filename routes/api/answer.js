const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const async = require('async');
const router = express.Router();
var func = require('./../commonfunction'); // call common fuctions
var sendResponse = require('./../sendresponse'); // send response to user
// User answer model 
require('../../models/users/answers');
const answerCollection = mongoose.model('answer_data');
// user comments model
require('../../models/users/comments');
const commentsCollection = mongoose.model('comment_data');
// Api to answer question
router.post('/answer', (req, res) => {
    var manValues = [req.body.questionId, req.body.answerText, req.body.answeredBy];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            let answerData = {
                question_id: req.body.questionId,
                answer_text: req.body.answerText,
                answered_by: req.body.answeredBy
            };
            new answerCollection(answerData).save().then(answer_data => {
                sendResponse.sendSuccessData(answer_data, res); // send successfull data submission response
            }).catch(function (err) {
                console.log(err);
                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
            });;
        })
});
// edit answer
router.post('/editanswer', (req, res) => {
    var manValues = [req.body.userId, req.body.answerId, req.body.updatedAnswerText];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            answerCollection.findOneAndUpdate({ _id: req.body.answerId, answered_by: req.body.userId }, { $set: { answer_text: req.body.updatedAnswerText } }, function (err, answer_data) {
                if (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    sendResponse.sendSuccessData(answer_data, res); // send successfull data submission response
                }
            });
        })
});

// delete answer
router.post('/deleteanswer', (req, res) => {
    var manValues = [req.body.userId, req.body.answerId];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            answerCollection.findOneAndRemove({
                _id: req.body.answerId,
                answered_by: req.body.userId
            }, function (err, answer_data) {
              
                if (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    if (answer_data !== null) {
                        commentsCollection.findByIdAndRemove(answer_data._id, function (err) {
                            if (err) {
                                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                            } else {
                                sendResponse.sendSuccessData('answer deleted successfully', res); // send successfull data submission response
                            }
                        });
                    } else {
                        sendResponse.sendErrorMessage('No answer found', res); // send err message if unable to save data 
                    }
                }
            
            })
        })
});

module.exports = router;
