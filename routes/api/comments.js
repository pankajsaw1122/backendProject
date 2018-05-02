const express = require('express');
const mongoose = require('mongoose');
const async = require('async');
const router = express.Router();
var func = require('./../commonfunction');
var sendResponse = require('./../sendresponse');
// User data model
require('../../models/users/comments');
const commentsCollection = mongoose.model('comment_data');

// Api to post comment
router.post('/comment', (req, res) => {
    var manValues = [req.body.answerId, req.body.commentText, req.body.commentedBy];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            let commentsData = {
                answer_id: req.body.answerId,
                comment_text: req.body.commentText,
                commented_by: req.body.commentedBy
            };
            new commentsCollection(commentsData).save().then(comment_data => {
                sendResponse.sendSuccessData(comment_data, res); // send successfull data submission response
            }).catch(function (err) {
                console.log(err);
                sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
            });;;
        })
});

// edit comment
router.post('/editcomment', (req, res) => {
    var manValues = [req.body.userId, req.body.commentId, req.body.updatedCommentText];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            commentCollection.findOneAndUpdate({ _id: req.body.commentId, commented_by: req.body.userId }, { $set: { comment_text: req.body.updatedCommentText } }, function (err, comment_data) {
                if (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                } else {
                    sendResponse.sendSuccessData(comment_data, res);
                }
            });
        })
});

// delete comment
router.post('/deletecomment', (req, res) => {
    var manValues = [req.body.userId, req.body.commentId];
    async.waterfall([
        function (callback) {
            func.checkBlank(res, manValues, callback);
        },
    ],
        function () {
            commentCollection.findByIdAndRemove(req.body.commentId, function (err) {
                if (err) {
                    sendResponse.sendErrorMessage('Something went wrong please try again later', res); // send err message if unable to save data 
                    res.send(err);
                } else {
                    sendResponse.sendSuccessData('deleted successfully', res); // send successfull data submission response
                }
            });
        })
});

// reply to comment
// router.post('/reply', (req, res) => {
//     var manValues = [req.body.commentId, req.body.replyText, req.body.repliedBy];
//     async.waterfall([
//         function (callback) {
//             func.checkBlank(res, manValues, callback);
//         },
//     ],
//         function () {
//             let replyData = {
//                 comment_id: req.body.questionId,
//                 reply_text: req.body.replyText,
//                 repliedBy: req.body.repliedBy
//             };
//             commentsCollection.findOneAndUpdate(
//                 { _id: req.body.commentId },
//                 { $push: { reply: replyData } },
//                 function (error, commentsCollection) {
//                     if (err) {
//                         res.send(err);
//                     } else {
//                         res.send(commentsCollection);
//                     }
//                 });
//         })
// });
module.exports = router;
