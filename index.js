// Import required modules
const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
const port = 8000;
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const userName = process.env.USERNAME1
const passWord = process.env.PASSWORD
const dbName = process.env.DATABASE
const secretKey = process.env.SECRETKEY1

// Parse incoming request data
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

// Serve static files from the 'assets' directory
app.use(express.static('assets'));

// Configure EJS view engine and layout settings
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './views');

// Create a MongoDB session store using connect-mongo
const mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${userName}:${passWord}@cluster0.y53e56l.mongodb.net/${dbName}?retryWrites=true&w=majority`, // MongoDB connection URL
    mongooseConnection: db, // Mongoose connection object
    autoRemove: 'disabled' // Disable automatic removal of expired sessions
});

// Configure and use express-session for session management
app.use(session({
    name: 'issueTracker',
    secret: secretKey, // Secret for session encryption
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // Session expiration time (in milliseconds)
    },
    store: mongoStore // Use the MongoDB session store
}));

// Use connect-flash for storing and displaying flash messages
app.use(flash());
app.use(customMware.setFlash);

// Include routes defined in the 'routes' module
app.use('/', require('./routes'));

// Start the server on the specified port
app.listen(port, function(err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
