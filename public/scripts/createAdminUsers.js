// Function to create admin users at the start of the application
// This function is called from the server.js file
// Dependencies
import User from "../../models/Users.model.js";
import * as dotenv from "dotenv";
dotenv.config();

// Admin users models
const adminUsers = [
    {
        username: "EGonzalez",
        password: process.env.ADMIN_PASS,
        email: "moonmedicineherbals@gmail.com",
        fullname: "Elia González Martínez",
        role: "admin",
    },
    {
        username: "DBoj",
        password: process.env.ADMIN_PASS,
        email: "dbojdev@proton.me",
        fullname: "Daniel Boj Cobos",
        role: "admin",
    },
];

const createAdminUsers = async () => {

    // Check if there are users in the database
    const admins = await User.find({ role: "admin" });

    // Check if there admins users already exist
    adminUsers.forEach(async (user) => {
        if (!admins.map(user => user.email).includes(user.email)) {
            
            // Create admin users
            try {
                const newUser = new User(user);
                await User.create(newUser);
                console.log(`Admin user ${user.username} created`);
            } catch (err) {
                console.log(err.message);
            }
        }
    });
}

export default createAdminUsers;