import dotenv from "dotenv"
import http from "http";
import app from "./app.js"
import connectDB from "./db/dbConnection.js";

dotenv.config();

const port = process.env.PORT || 3000;

const startServer = async () => {

    await connectDB();

    const server = http.createServer(app);

    server.listen(port, () => {
        console.log("Server is running");
    });
};

startServer();