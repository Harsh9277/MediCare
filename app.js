require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error(err));

// Set View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
// Yeh line apne aap public folder se index.html ko dhoondh legi
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Import Routes
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin');

// Use Routes
app.use('/blog', blogRoutes);
app.use('/admin', adminRoutes);

// Route for the main static homepage - ISKI AB ZAROORAT NAHI HAI
/*
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
*/

app.listen(PORT, () => {
    console.log(`Server is running!`);
    console.log(`Main Website: http://localhost:${PORT}`);
    console.log(`Blog Page: http://localhost:${PORT}/blog`);
    console.log(`Admin Login: http://localhost:${PORT}/admin/login`);
});