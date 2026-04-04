import express from "express";
import authRoute from "./routes/auth.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/auth", authRoute);

app.get("/health", (req, res) => {
    res.send("Server is Alive !!!");
});

export default app;