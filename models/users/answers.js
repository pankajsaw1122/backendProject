const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const answerSchema = new Schema({

    question_id : {
        type: Schema.Types.ObjectId,
        required: true
    },
    answer_text: {
        type: String,
        required: true
    },
    answered_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    post_date: {
        type: Date,
        default: Date.now()
    },
    liked: {
        type: Number,
        required: false
    },
    disliked: {
        type: Number,
        required: false
    }
});
mongoose.model('answer_data', answerSchema);