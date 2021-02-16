const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect(`mongodb+srv://drdung1999:onichan123@cluster0.lbxxt.mongodb.net/pinet2?retryWrites=true&w=majority&ssl=false`,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    // try connect mongodb
    const db = mongoose.connection;

    // log result
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    console.log('Connect mongDB success');
    });
}

module.exports = connectDB