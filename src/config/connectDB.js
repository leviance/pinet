const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(`${process.env.DB_CONNECTION}://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.ix9fz.mongodb.net/Pinet?retryWrites=true&w=majority`,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    // try connect mongodb
    const db = mongoose.connection;

    // log result
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log('Connect mongDB success');
    });
}

module.exports = connectDB