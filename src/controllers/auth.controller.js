import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { isStrongPassword, isValidEmail } from "../utils/validation.js";
import User from "../models/user.model.js";
import AccessControl from "../models/AccessControl.model.js";
import RefreshToken from "../models/RefreshToken.model.js";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();

const generateAccessToken = (user) => {

    const accessToken = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "60m"
        }
    );

    return accessToken;
}

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString("hex");
};

export const register = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password is weak"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.HASH_ROUNDS));

        const verificationToken = crypto.randomBytes(32).toString("hex");

        await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpires:
                Date.now() + 1000 * 60 * 60,
            isVerified: false
        });

        const verifyUrl = `${process.env.SERVER_URL}/auth/verify-email?token=${verificationToken}`;

        await sendEmail({
            to: email,
            subject: "Verify your email",
            html: `<h2>Hello ${name},</h2>
                   <p>Click the link below to verify your email:</p>
                   <a href="${verifyUrl}"><button>Verify</button></a>`
        });

        res.status(201).json({
            message: "Verification email sent"
        });

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const verifyEmail = async (req, res) => {

    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({
                message: "Verification token required"
            });
        }

        const user = await User.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid verification token"
            });
        }

        if (user.isVerified) {
            return res.json({
                message: "Email already verified"
            });
        }

        if (user.verificationExpires < Date.now()) {
            return res.status(400).json({
                message: "Verification link expired"
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();

        res.json({
            message: "Email verified successfully",
        });

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Login failed"
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Verify email first"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Login failed"
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken();

        await RefreshToken.create({
            user: user._id,
            token: refreshToken,
            expiresAt:
                Date.now() + 1000 * 60 * 60 * 24 * 7
        });

        res.status(200).json({
            message: "User logged in",
            user,
            accessToken,
            refreshToken
        });

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        });
    }
}

export const refresh = async (req, res) => {

    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "refreshToken required"
            });
        }

        const tokenDoc = await RefreshToken.findOne({
            token: refreshToken
        }).populate("user");

        if (!tokenDoc) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (tokenDoc.expiresAt < Date.now()) {

            await tokenDoc.deleteOne();

            return res.status(401).json({
                message: "Refresh token expired"
            });
        }

        const accessToken = generateAccessToken(tokenDoc.user);

        res.status(200).json({ accessToken });

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const logout = async (req, res) => {

    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "refreshToken required"
            });
        }

        await RefreshToken.deleteOne({
            token: refreshToken
        });

        res.json({
            message: "Logged out successfully"
        });

    }
    catch (err) {
        res.status(500).json({
            messrage: err.message
        });
    }
};

export const logoutAll = async (req, res) => {

    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        await RefreshToken.deleteMany({
            user: userId
        });

        res.json({
            message: "Logged out from all devices"
        });

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

export const me = async (req, res) => {

    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select("-password -verificationToken -verificationExpires")
            .populate({
                path: "grantedDocs",
                populate: {
                    path: "document"
                }
            });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};