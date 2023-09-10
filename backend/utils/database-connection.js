const mongoose = require("mongoose");
assert = require("assert");

// Suppress deprecation
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URL;

mongoose.Promise = global.Promise;

mongoose.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log(`\n You are successfully connected to the database at: ${process.env.MONGO_DB_NAME}`);
    })
    .catch((err) => {
        console.log(`Could not connect ${process.env.MONGO_DB_NAME}. Error...`, err);
        process.exit();
    });

mongoose.connection.on('error', (err) => {
    console.error('Failed to connect to MongoDB:', err);
});

mongoose.set("debug", true);

module.exports = mongoose.connection;



