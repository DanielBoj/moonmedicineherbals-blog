// Dependencies
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Model
import Users from "../models/Users.model.js";

// Password encription
const SALT_WORK_FACTOR = 10;

const encryptPassword = (Users, next) => {

    // Check if the password is modified or is new
    if (!Users.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // Hash the password using our new salt
        bcrypt.hash(user.password, salt, (err, hassh) => {
            if (err) return next(err);
        });

        // Override the cleartext password with the hashed one
        Users.password = hash;

        next();
    });
}

const comparePassword = (candidatePasswrd, cb) => {
    return bcrypt.compare(candidatePasswrd, Users.password, (err, isMatch) => {
        if (err)
            return cb(err);
        return cb(null, isMatch);
    });
}

export default { encryptPassword, comparePassword };
