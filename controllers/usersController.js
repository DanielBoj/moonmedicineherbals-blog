// Controllers are responsible for handling requests and returning responses
// to the client.
// Dependencies
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { expressjwt as ejwt } from "express-jwt";

// Environment variables
import dotenv from "dotenv";
dotenv.config();

// Import the users model
import Users from "../models/Users.model.js";

// Import testing users
// import users from "../innerdb/users.js";

// Connect to MongoDB
const db = mongoose.connection;

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

// CRUD operations
const User = {
    // View all users
    list: async (req, res, next) => {
        const users = await Users.find().sort("email");
        res.status(200).send(users);
    },
    listUserById: async (req, res, next) => {
        const { id } = req.params;

        try {
            const actualUser = await Users.findById(id);
            if (!actualUser) {
                return res.status(401).send("User not found");
            }

            //req.user = actualUser;
            res.status(200).send(actualUser);
        } catch (err) {
            err.message = "User not found";
            res.status(500).send(err.message);
        }
    },
    create: async (req, res, next) => {
        // Get the data from the request
        const { body } = req;

        // Check for existing user
        try {
            const isUser = await Users.findOne({ email: body.email });

            if (isUser) {
                return res.status(403).send("User already exists").end();
            }

            // Validate that all necessary fields are present
            if (!body.username || !body.password || !body.email) {
                return res.status(400).send("Missing fields").end();
            }

            // Create the password hash
            // const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
            // const hashed = await bcrypt.hash(body.password, salt);

            // Create the new user
            const newUser = new Users({
                username: body.username,
                password: body.password,
                //salt: salt,
                fullname: body.fullname ? body.fullname : username,
                email: body.email,
                role: body.role ? body.role : "subscriber",
            });

            //Add the new user to the database
            await Users.create(newUser);

            // Creating the token
            const signedToken = signToken(newUser._id);

            res.status(201).send(`Token: ${signedToken} Id: ${newUser._id}`).end();
        } catch (err) {
            res.status(500).send(err.message).end();
        }
    },
    update: async (req, res, next) => {
        // Get the user ID and the data for the updated user
        const { id } = req.params;
        const { body } = req;

        // Search the existing user
        try {

            const actualUser = await Users.findById(id);

            // Check if the user exists
            if (!actualUser) {
                return res.status(401).send("User not found").end();
            }

            // Validate that all necessary fields
            if (body.username) {
                actualUser.username = body.username;
            } else {
                actualUser.username = actualUser.username;
            }

            if (body.password) {
                const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
                const hashed = await bcrypt.hash(body.password, salt);
                actualUser.password = hashed;
                actualUser.salt = salt;
            } else {
                actualUser.password = actualUser.password;
            }

            if (body.fullname) {
                actualUser.fullname = body.fullname;
            } else {
                actualUser.fullname = actualUser.fullname;
            }

            if (body.email) {
                actualUser.email = body.email;
            } else {
                actualUser.email = actualUser.email;
            }

            // Update the user
            const updatetedUser = await Users.updateOne(actualUser);   
            res.status(200).send(updatetedUser).end();
        } catch (err) {
            res.status(500).send(err.message).end();
        }
    },
    delete: async (req, res, next) => {

        // Get the user ID
        const { id } = req.params;

        // Get the user to delete
        try {
            const userToDelete = await Users.findById(id);

            if (!userToDelete) {
                return res.status(401).send("User not found").end();
            }

            // Delete the user
            await Users.deleteOne(userToDelete);

            res.status(200).send(`User ${userToDelete.id} deleted`).end();
        } catch (err) {
            err.message = "User not found";
            res.status(500).send(err.message).end();
        }
    }
};

// Export the controller
export default User;
