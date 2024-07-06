const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registrationDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Route for serving the registration form
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for handling form submission
app.post('/register', async (req, res) => {
    const { name, email, password, 'confirm-password': confirmPassword } = req.body;

    if (password !== confirmPassword) {
        // Passwords do not match
        res.sendFile(path.join(__dirname, 'public', 'error.html'));
    } else {
        try {
            const newUser = new User({ name, email, password });
            await newUser.save();
            // Registration successful
            res.sendFile(path.join(__dirname, 'public', 'success.html'));
        } catch (error) {
            console.error(error);
            res.sendFile(path.join(__dirname, 'public', 'error.html'));
        }
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
