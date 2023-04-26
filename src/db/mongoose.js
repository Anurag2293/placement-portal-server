const mongoose = require('mongoose')
const mongooseURI = 'mongodb://127.0.0.1:27017/placement-portal';

mongoose.set('strictQuery', false);
mongoose.connect(mongooseURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((e) => console.log('There was an error connecting'));