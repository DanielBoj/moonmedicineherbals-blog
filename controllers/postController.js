// Controllers are responsible for handling requests and returning responses
// to the client.

// Dependencies 
import mongoose from 'mongoose';

// Import the models 
import Post from '../models/Posts.model.js';
import User from '../models/Users.model.js';

// Coonect with the DB
const db = mongoose.connect;

// Middleware functions
const postMiddleware = (req, res, next) => {
    console.log('Time of request: ', Date.now());
    next();
}

// Posts controller -> Object with the diferent functions implemented in it
const post = {
    // Lists all posts sorted by publication date
    list: async (req, res, next) => {
        try {
            const posts = await Post.find().sort('publicationDate').populate('user'); /* We use .populate beacuse the post model has an attribute related to an use, so we have to fill it with .populate */

            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Find posts from an user
    findFromUser: async (req, res, next) => {
        // Get the data from the request
        const userId = req.params.id;

        try {
            const posts = await Post.find({ 'user': userId }).sort('publicationDate').populate('user');

            res.status(200).json(posts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Create a new post
    post: async (req, res, next) => {
        // Getting the data 
        const userId = req.body.iduser;

        try {
            // Cheack if the user already exists
            const user = await User.findById(userId);

            if (user) {
                // Get the remaining data 
                const { title, description } = req.body;
                // Create the Post
                const post = new Post ({
                    user: userId,
                    title: title,
                    description: description,
                });

                // Add the new post in the post list of the user 
                try {
                    await user.posts.push(post);
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }

                // Save the post 
                try {
                    await user.save();
                    await post.save();

                    res.status(200).json({ created: true, user: userId, post: post, message: 'Post created!' });
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
            } else {
                send.status(200).json({ created: false, message: 'User not exists' });
            }
        } catch (err) {
            send.status(500).json({ error: err.message });
        }
    },
    // Update an existing post 
    update: async (req, res, next) => {
        // Get the data 
        const id = req.params.id;
        const body = req.body;

        // Find the original post and update it with a mongo CRUD function 
        try {
            const post = await Post.findByIdAndUpdate(id, body);

            res.status(200).json({ updated: true, post: post, message: 'Post updated!' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Delete an existing post 
    delete: async (req, res, next) => {
        // Get the data 
        const id = req.params.id;

        // Find and delete the post if exists 
        try {
            const post = await Post.findByIdAndDelete(id);

            if (post) {

                try {
                    const user = await User.findByIdAndUpdate(post.user, {$pull: { posts: post._id }});
                } catch (err) {
                    res.status(500).json({ error: err.message });
                }
                return res.status(200).json({ deleted: true, post: post, message: 'Post deleted!' });
            } else {
                return res.status(500).json({ message: `The post ${id} doesn't exists!` });
            }

        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    // Get the about information
    about: async (req, res, next) => {
        // Get the data 
        const id = req.params.id;

        try {
            const post = await Post.findById(id);

            if (post) {
                // Send the information 
                res.status(200).json({ user: post.user,
                                        title: post.title,
                                        date: post.publicationDate,
                                        id: post._id,
                });
            } else {
                res.status(500).json({ message: `The post ${id} doesn't exists.` });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
}

// Export the controller
export default post;
