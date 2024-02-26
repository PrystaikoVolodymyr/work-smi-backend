const { Schema, model} = require('mongoose')

const userSchema = new Schema({
    displayName: { type: String, required: false},
    email: { type: String, required: true, unique: true},
    uid: { type: String, required: true, unique: true},
    photo: { type: String, required: false},
    claims: { type: Object},
    name: { type: String, required: false},
    surname: { type: String, required: false}
}, {timestamps: true})

module.exports = model("User", userSchema)