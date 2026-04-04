import mongoose from "mongoose";

const connectDB = async () => {

    console.log("Connecting to DB...");
    mongoose.connect(process.env.DB_URI)
        .then(() => {
            console.log("Connected to DB successfully !!!");
        })
        .catch((err) => {
            console.error("DB Connection Failed", err);
        });
};

export default connectDB;