const express = require('express');
const logger = require('morgan');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

app.use(logger('dev'));
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
.then(() => console.log('database is connected...'))
.catch(err => console.log(err));

mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected!');
});

// Middleware
app.use(express.json());

// Route Middleware
app.use('/user', authRoute);
app.use('/posts', postRoute);

app.listen(3000, () => console.log('Server Up and Running'));