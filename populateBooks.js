// I created a script to create a 'Books' collection using Node.js and Mongoose. 
// This script also stores the required books and their borrowers.

const mongoose = require('mongoose');

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

const bookSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    available: { type: Boolean, default: true },
    borrower: { type: String, default: null }
});

const Book = mongoose.model('Book', bookSchema);

const books = [
    { id: 11345, title: 'The Shining', author: 'Stephen King', available: false, borrower: 'ringo@beatles.uk' },
    { id: 12406, title: 'Rainbow Six', author: 'Tom Clancy', available: true },
    { id: 29937, title: 'Steve Jobs', author: 'Walter Isaacson', available: true },
    { id: 44444, title: 'Elon Musk', author: 'Ashley Vance', available: false, borrower: 'george.tsang@senecacollege.ca' },
    { id: 48918, title: 'Pride and Prejudice', author: 'Jane Austen', available: true },
    { id: 50000, title: 'Killing Floor', author: 'Lee Child', available: false, borrower: 'george.tsang@senecacollege.ca' },
    { id: 55755, title: 'Rules of Prey', author: 'John Sandford', available: true },
    { id: 68529, title: 'The C Programming Language', author: 'Kernighan and Ritchie', available: true },
    { id: 76008, title: 'On a Pale Horse', author: 'Piers Anthony', available: true },
    { id: 79112, title: 'Mortal Stakes', author: 'Robert B. Parker', available: true },
    { id: 83098, title: 'The Firm', author: 'John Grisham', available: false, borrower: 'george.tsang@senecacollege.ca' },
    { id: 86868, title: 'Exit Lines', author: 'Reginald Hill', available: true },
    { id: 90044, title: 'Point of Impact', author: 'Stephen Hunter', available: false, borrower: 'mick@rollingstones.uk' },
    { id: 93571, title: 'Pronto', author: 'Elmore Leonard', available: true },
    { id: 99992, title: 'A Deadly Shade of Gold', author: 'John D. MacDonald', available: true }
];

async function populateBooks() {
    try {
        await Book.deleteMany({});
        await Book.insertMany(books);
        console.log('Books inserted');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error inserting books:', err);
        mongoose.disconnect();
    }
}

populateBooks();
