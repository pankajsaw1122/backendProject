const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = new Schema({

    answer_id : {
        type: Schema.Types.ObjectId,
        required: true
    },
    comment_text: {
        type: String,
        required: true
    },
    commented_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    post_date: {
        type: Date,
        default: Date.now()
    },
    liked: {
        type: String,
        required: false
    },
    disliked: {
        type: String,
        required: false
    },
    reply: [{
        reply_text: String,
        replied_by: mongoose.Schema.Types.ObjectId,
        reply_post_date: Date
    }]
});
mongoose.model('comment_data', commentSchema);