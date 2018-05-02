const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

    user_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true 
    },
    contact: {
        type: String,
        required: true
    },
    working_at: {
        type: String,
        required: false
    },
    qualification: {
        type: String,
        required: false
    },
    studied_at: {
        type: String,
        required: false
    },
    lives_in: {
        type: String,
        required: false
    },
    creation_date: {
        type: Date,
        default: Date.now()
    },
    profileimage_id: {
        type: Schema.Types.ObjectId,
        required: false
    }
});
mongoose.model('user_data', userSchema);