const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const imageSchema = new Schema({
    
upload_date: {
        type: Date,
        default: Date.now()
    },
    upload_path: {
        type: String,
        required: true
    }
});
mongoose.model('profile_image', imageSchema);