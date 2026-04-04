import mongoose from "mongoose";

const accessControlSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },

    role: {
        type: String,
        enum: ["viewer", "commenter", "editor"],
        default: "viewer"
    },

    grantedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    source: {
        type: String,
        enum: ["request", "manual"],
        default: "manual"
    }

}, { timestamps: true });

const accessControlModel = mongoose.model("accessControl", accessControlSchema);

export default accessControlModel;