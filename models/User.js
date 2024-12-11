const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

// We do not put username and password in userSchema because passport-local-mongoose middleware defines them by default

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema)