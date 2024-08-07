const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const randomstring = require('randomstring');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;  // Use the environment variable for the port or default to 3000

// MongoDB connection
const mongoURI = 'mongodb+srv://kjumamil:Papa0201@web322.0jydutd.mongodb.net/?retryWrites=true&w=majority&appName=Web322';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected...');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Configure the Handlebars view engine
app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views/partials'),
    layoutsDir: path.join(__dirname, 'views/layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Set up session middleware before the routes to ensure session is available
app.use(session({
  secret: randomstring.generate(), // Dynamically generate a secure secret
  resave: false,
  saveUninitialized: false
}));

// Add cache-control middleware to prevent caching on sensitive pages
app.use((req, res, next) => {
    if (req.path.startsWith('/signin')) { // Adjust the path as necessary
        res.set('Cache-Control', 'no-store');
    }
    next();
});

// Import and use routes defined in routes/index.js
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// Start the server//
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
