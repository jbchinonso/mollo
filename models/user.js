const mongoose = require("mongoose")
const Joi = require("joi")

const user = new mongoose.Schema({
    username: { type: String },
    email: { type: String, index: true },
    password: String
})


const User = mongoose.model("user", user)


function validateUser(user) {
    const schema = {
        username: Joi.string().required(),
        email: Joi.string().email().min(5).max(100).lowercase().trim().required(),
        password: Joi.string().required()
    }

    return Joi.object(schema).validate(user)
}

exports.User = User
exports.validateUser = validateUser 