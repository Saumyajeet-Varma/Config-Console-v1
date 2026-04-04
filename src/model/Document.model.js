import mongoose from "mongoose";

const docSchema = new mongoose.Schema({

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

const docModel = mongoose.model("docs", docSchema);

export default docModel;
