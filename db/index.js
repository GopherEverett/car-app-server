const mongoose = require('mongoose');
const { DATABASE_URI } = process.env;

mongoose.connect(DATABASE_URI)

mongoose.connection
    .on('connected', () => {
        console.log('Connected to the database')
    })
    .on('error', (error) => {
        console.log('Database error', error)
    }).on('disconnected', () => {
        console.log('Database disconnected')
    })