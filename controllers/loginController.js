// Login services to check if the user is valid or not
// Dependencies
import express from 'express';
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { expressjwt as ejwt } from "express-jwt";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Import the users model
import Users from "../models/Users.model.js";

// Connect to MongoDB
// const db = mongoose.connection;

// Password encription
// const SALT_WORK_FACTOR = 10;

// Validatin of the JWT token
const validateJwt = ejwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS2656"],
});

// Creation function for the JWT token and expiration time
const signToken = (_id) =>
    jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "24h" });

// Find and assign user
const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req.auth._id);
        if(!user) {
            return res.status(401).send({ found: false }).end();
        }

        req.user = user;
        next();
    } catch (err) {
        next(res.status(500).send(err.message));
    }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser);

// CRUD operations
const Auth = {
    // Log the user
    login: async (req, res) => {
        // Get the data from the request
        const { body } = req;

        // Check if the user exists
        try {
            const user = await Users.findOne( { email: body.email } );

            if(!user) {
                res.status(401).send({ 
                    found: false,
                    message: 'Invalid user!' });
            } else {
                // Check if the password is correct
                // const isMatch = await bcrypt.compare(body.password, user.password);
                const isMatch = user.comparePassword(body.password);
                // If the password is correct, create the token
                if(isMatch) {
                    const signedToken = signToken(user._id);
                    res.status(200).send({
                        found: true,
                        token: signedToken,
                        user: user
                    });
                } else {
                    res.status(403).send({
                        found: false,
                        message: 'Invalid password!',
                    });
                }
            }
        }  catch (err) {
            res.status(500).send(err.message);
        }
    },
    // Registes a new user
    register: async (req, send) => {
        // Get the data from the request
        const { body } = req.body;

        // Check if the user exists or create the new user
        try {
            const isUser = await Users.findOne({ email: body.email });

            if(isUser) {
                return res.status(403).send({
                    found: true,
                    message: 'The user already exists!',
                })
            }

            // Create the new user
            const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            const hash = await bcrypt.hash(body.password, salt);
            const newUser = await Users.create({ 
                username: body.usernames,
                email: body.email,
                password: hash, salt,
                fullname: body.fullname ? body.fullname : username,
                role: body.role ? body.role : "subscriber",
             });

             // Create the token
             const signedToken = signToken(newUser._id);
             res.status(200).send({
                registered: true,
                token: signedToken,
                user: newUser,
             });
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
}

export default Auth;
