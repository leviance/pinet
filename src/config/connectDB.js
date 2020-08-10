const mongoose = require('mongoose');

function connectDB(){
    let DB_CONNECTION = 'mongodb'
    let DB_HOST = 'localhost'
    let DB_PORT = 27017
    let DB_NAME = 'pinet'
    let DB_USERNAME = ''
    let DB_PASSWORD = ''

    mongoose.connect(`${DB_CONNECTION}://${DB_HOST}:${27017}/${DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true});

    // try connect mongodb
    const db = mongoose.connection;

    // log result
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log('Connect mongDB success');
    });
}

module.exports = connectDB