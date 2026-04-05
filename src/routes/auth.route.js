import express from "express";
import { register, verifyEmail, login, refresh, logout, logoutAll, me } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// TESTED
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.get("/verify-email", verifyEmail);
router.post("/logout", logout);

// NOT TESTED YET
router.post("/refresh", refresh);    // Most probably this should work :)
router.post("/logout-all", authMiddleware, logoutAll);

export default router;