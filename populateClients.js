// I created a script to create a 'Clients' collection using Node.js and Mongoose. 
// This script also stores the users and the new registered users.

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

const clientSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    borrowedBooks: { type: [Number], required: true }
});

const Client = mongoose.model('Client', clientSchema);

const clients = [
    { username: 'george.tsang@senecacollege.ca', password: 'web322n1a', borrowedBooks: [44444, 50000, 83098] },
    { username: 'john@beatles.uk', password: 'lennonj!', borrowedBooks: [] },
    { username: 'paul@beatles.uk', password: 'mccartney', borrowedBooks: [] },
    { username: 'george@beatles.uk', password: 'harrison', borrowedBooks: [] },
    { username: 'ringo@beatles.uk', password: 'starrr!!', borrowedBooks: [11345] },
    { username: 'mick@rollingstones.uk', password: 'jaggerm!', borrowedBooks: [90044] },
    { username: '1@gmail.com', password: '123456', borrowedBooks: [] }
];

async function populateClients() {
    try {
        await Client.deleteMany({});
        await Client.insertMany(clients);
        console.log('Clients inserted');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error inserting clients:', err);
        mongoose.disconnect();
    }
}

populateClients();
