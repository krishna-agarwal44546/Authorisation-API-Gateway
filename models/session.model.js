const mongoose=require('mongoose')

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    otp: { type: String }, // Add this missing field so Mongo can save it
    refresh_token: { type: String, required: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    revoked: { type: Boolean, default: false }
});

module.exports=mongoose.model("session",sessionSchema);