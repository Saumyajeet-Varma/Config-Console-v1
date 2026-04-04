import mongoose from "mongoose";

const accessRequestSchema = new mongoose.Schema({

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

    requestedRole: {
        type: String,
        enum: ["viewer", "commenter", "editor"],
        default: "viewer"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

const accessRequestModel = mongoose.model("accessRequest", accessRequestSchema);

export default accessRequestModel;