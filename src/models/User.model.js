import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        required: true,
        unique: true
    },

    // AUTH
    password: {
        type: String,
        default: null
    },

    // AUTH
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },

    // AUTH
    googleId: {
        type: String,
        default: null
    },

    // AUTH
    isVerified: {
        type: Boolean,
        default: false
    },

    verificationToken: String,
    verificationExpires: Date,

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    grantedDocs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "AccessControl"
    }]

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;