const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Show all blog posts
router.get('/', async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: 'desc' });
        res.render('blog', { posts: posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Show a single blog post
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).send('Post not found');
        res.render('post', { post: post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;