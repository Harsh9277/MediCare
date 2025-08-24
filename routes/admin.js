const express = require('express');
console.log("DEBUG: routes/admin.js file is being read!"); // <-- YEH LINE ADD KI HAI
const router = express.Router();
const bcrypt = require('bcrypt');
const BlogPost = require('../models/BlogPost');

// Hash the password from .env file for security
const adminUsername = process.env.ADMIN_USERNAME;
const adminPasswordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);

// Middleware to check if admin is logged in
function isAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
}

// GET /admin/login - Show login page
router.get('/login', (req, res) => {
    console.log("DEBUG: Request reached /admin/login route."); // <-- YEH LINE ADD KI HAI
    res.render('admin/login');
});

// POST /admin/login - Handle login attempt
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUsername && bcrypt.compareSync(password, adminPasswordHash)) {
        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid username or password.');
    }
});

// GET /admin/dashboard - Show admin panel (Protected)
router.get('/dashboard', isAdmin, async (req, res) => {
    const posts = await BlogPost.find().sort({ createdAt: 'desc' });
    res.render('admin/dashboard', { posts: posts });
});

// POST /admin/add - Create a new blog post
router.post('/add', isAdmin, async (req, res) => {
    const { title, imageUrl, author, content } = req.body;
    const newPost = new BlogPost({ title, imageUrl, author, content });
    await newPost.save();
    res.redirect('/admin/dashboard');
});

// POST /admin/delete/:id - Delete a post
router.post('/delete/:id', isAdmin, async (req, res) => {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
});

// GET /admin/logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

module.exports = router;