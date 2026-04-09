import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import morgan from "morgan"
import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.UI_URL,
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/auth", authRoute);

app.get("/health", (req, res) => {
    res.send("Server is Alive !!!");
});

export default app;