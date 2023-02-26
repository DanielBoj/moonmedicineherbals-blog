// Dependencies
import express from 'express';

// Controllers
import post from '../controllers/postController.js';

// Create router
const router = express.Router();

// Test middleware
// router.use(postController.postMiddleware);

// Main route gets all the posts from all users sorted by date 
router.get('/', post.list);

// Getting all the posts from 1 user
router.get('/all/:id', post.findFromUser);

// Add new post
router.post('/', post.post);

// Update an existing post 
router.put('/:id', post.update);

// Delete an existing post 
router.delete('/:id', post.delete);

// About route
router.get('/about/:id', post.abaout);

// Export router to main.js
export default router;
