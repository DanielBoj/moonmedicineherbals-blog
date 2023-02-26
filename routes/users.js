// Dependencies
import express from 'express';

// Import controllers
import User from '../controllers/usersController.js';
import  Auth from '../controllers/loginController.js';

// Create router
const router = express.Router();

// Main route => view all users
router.get('/', User.list);

// View user by ID
router.get('/:id', User.listUserById);

// Create a new user
router.post('/', User.create);

// Update an user
router.put('/:id', User.update);

// Delete an user
router.delete('/:id', User.delete);

// user Login Service
router.post('/login', Auth.login);

// user Register Service
router.post('/register', Auth.register);

// Export router to main.js
export default router;