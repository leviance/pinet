const mongoose = require('mongoose');

function connectDB(){
    

    const dbURI = "mongodb+srv://drdung1999:onichan123@cluster0.lbxxt.mongodb.net/pinet2?retryWrites=true&w=majority"; 
    mongoose.connect(dbURI,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}).then((result) => { 
        console.log('connected to db') 
    }).catch((err) => console.log(err));
}

module.exports = connectDB