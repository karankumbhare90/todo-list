import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { generateToken } from '../utils/jwtOperation.js'
import User from "../models/userModels.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Check if user already exists
    const existsUser = await User.findOne({ email });
    if (existsUser) {
        return res.status(400).json({
            success: false,
            message: "User already exists",
        });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    if (user) {
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: generateToken({ id: user._id, email: user.email }),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } else {
        return res.status(500).json({
            success: false,
            message: "Failed to register user",
        });
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }

    // Return token
    return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken({ id: user._id }),
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    });
});

export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(200).json({
        success: true,
        user,
    });
});