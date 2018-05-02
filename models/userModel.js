var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required:true, index: { unique: true }},
    fullName: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    password: { type: String, required: true, select: false } //omit the password when doing a get
    
});

module.exports = mongoose.model("User", userSchema);