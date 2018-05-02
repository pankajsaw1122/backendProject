const express = require('express');
const async = require('async');
const mongoose = require('mongoose');
const router = express.Router();
var func = require('./../commonfunction');
var sendResponse = require('./../sendresponse');

// Load question Model
require('../../models/users/questions');
const questionCollection = mongoose.model('question_data');
// Load Answer Model
require('../../models/users/answers');
const answerCollection = mongoose.model('answer_data');
// Load comment Model
require('../../models/users/comments');
const commentsCollection = mongoose.model('comment_data');

// Api question api
router.post('/ask', (req, res) => {
    var manValues = [req.body.questionText, req.body.askedBy];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            let questionData = {
                question_text: req.body.questionText,
                asked_by: req.body.askedBy
            };
            // save question in collection
            new questionCollection(questionData).save().then(question_data => {
                sendResponse.sendSuccessData(question_data, res);
            }).catch(function (err) {
                console.log(err);
                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
            });
        })
});
// edit question api
router.post('/editquestion', (req, res) => {
    var manValues = [req.body.userId, req.body.questionId, req.body.updatedQuestionText];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            answerCollection.find({
                question_id: req.body.questionId
            }).limit(1).count().exec(function (err, answer_data) {
                if (answer_data.length !== 0 || answer_data !== undefined) {
                    questionCollection.findOneAndUpdate({ _id: req.body.questionId, asked_by: req.body.userId }, { $set: { question_text: req.body.updatedQuestionText } }, function (err, question_data) {
                        if (err) {
                            sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                        } else {
                            sendResponse.sendSuccessData(question_data, res);
                        }
                    });
                } else {
                    sendResponse.sendErrorMessage('Question has been answered so you cant update it now', res);
                }
            })
        })
});

// APi for delete question it's corresponding answer and comments
router.post('/deletequestion', (req, res) => {
    var manValues = [req.body.userId, req.body.questionId];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            answerCollection.findOneAndRemove({
                question_id: req.body.questionId,
                asked_by: req.body.userId
            }, function (err, answer_data) {
                console.log(answer_data);
                if (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                } else {
                    if (answer_data == null) {
                        questionCollection.findByIdAndRemove(req.body.questionId, function (err) {
                            if (err) {
                                sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                            } else {
                                sendResponse.sendSuccessData('question deleted successfully', res);
                            }
                        });
                    } else {
                        commentsCollection.findByIdAndRemove(answer_data._id, function (err) {
                            if (err) {
                                sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                            } else {
                                questionCollection.findByIdAndRemove(req.body.questionId, function (err) {
                                    if (err) {
                                        sendResponse.sendErrorMessage('Something went wrong please try again later', res);
                                    } else {
                                        sendResponse.sendSuccessData('question deleted successfully', res);
                                    }
                                });
                            }
                        });
                    }
                }
            })
        })
});

module.exports = router;
