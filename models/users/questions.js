const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const questionSchema = new Schema({

    question_text : {
        type: String,
        required: true
    },
    asked_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    post_date: {
        type: Date,
        default: Date.now()
    },
}); 
mongoose.model('question_data', questionSchema);