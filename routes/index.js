const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const randomstring = require('randomstring');
const router = express.Router();

const sessionSecret = process.env.SESSION_SECRET || randomstring.generate();

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

const Book = mongoose.model('Book', new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    available: { type: Boolean, default: true },
    borrower: { type: String, default: null }
}));

const Client = mongoose.model('Client', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    borrowedBooks: { type: [Number], required: true }
}));

router.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 180000 }
}));

function isAuthenticated(req, res, next) {
    if (!req.session.username) {
        return res.redirect('/signin');
    }
    next();
}

function noCache(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
}

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/signin', (req, res) => {
    res.render('signin', { error: null });
});

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        const client = await Client.findOne({ username });
        if (client && client.password === password) {
            req.session.username = username;
            res.redirect('/home');
        } else {
            const error = "Invalid username or password";
            res.render('signin', { error });
        }
    } catch (err) {
        console.error('Error during sign-in:', err);
        res.render('signin', { error: "An error occurred during sign-in. Please try again." });
    }
});

router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingClient = await Client.findOne({ username });
        if (existingClient) {
            res.render('register', { error: "Username already taken" });
        } else {
            const client = new Client({ username, password, borrowedBooks: [] });
            await client.save();
            res.redirect('/signin');
        }
    } catch (err) {
        console.error('Error during registration:', err);
        res.render('register', { error: "An error occurred while registering. Please try again." });
    }
});

router.get('/signout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

router.get('/home', isAuthenticated, noCache, async (req, res) => {
    try {
        const books = await Book.find({});
        const availableBooks = books.filter(book => book.available);

        const client = await Client.findOne({ username: req.session.username });
        const borrowedBooks = books.filter(book => client.borrowedBooks.includes(book.id));

        console.log('Available Books:', availableBooks);
        console.log('Borrowed Books:', borrowedBooks);

        res.render('home', {
            availableBooks: availableBooks,
            borrowedBooks: borrowedBooks,
            username: req.session.username
        });
    } catch (err) {
        console.error('Error retrieving books:', err);
        res.render('home', { error: "An error occurred while loading the home page. Please try again." });
    }
});

router.post('/borrow', isAuthenticated, async (req, res) => {
    const selectedBookIds = [].concat(req.body.bookIds || []);
    try {
        await Book.updateMany(
            { id: { $in: selectedBookIds }, available: true },
            { $set: { available: false, borrower: req.session.username } }
        );
        
        await Client.updateOne(
            { username: req.session.username },
            { $push: { borrowedBooks: { $each: selectedBookIds.map(id => parseInt(id)) } } }
        );

        res.redirect('/home');
    } catch (err) {
        console.error('Error borrowing books:', err);
        res.redirect('/home');
    }
});

router.post('/return', isAuthenticated, async (req, res) => {
    const selectedBookIds = [].concat(req.body.returnIds || []);
    try {
        await Book.updateMany(
            { id: { $in: selectedBookIds }, available: false, borrower: req.session.username },
            { $set: { available: true, borrower: null } }
        );
        
        await Client.updateOne(
            { username: req.session.username },
            { $pull: { borrowedBooks: { $in: selectedBookIds.map(id => parseInt(id)) } } }
        );

        res.redirect('/home');
    } catch (err) {
        console.error('Error returning books:', err);
        res.redirect('/home');
    }
});

module.exports = router;
