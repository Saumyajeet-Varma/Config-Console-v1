import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({

    title: String,

    googleDocId: String,

    googleDocUrl: {
        type: String,
        required: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

const Document = mongoose.model("Document", documentSchema);

export default Document;
