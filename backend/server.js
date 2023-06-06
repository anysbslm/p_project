const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const home = require('./routes/home');
const users = require('./routes/user');
const devicesRouter = require('./routes/devices');
const cors = require('cors');


// express app 
const app = express();


// enables Cross-Origin Resource Sharing (CORS) for all routes in the application.
// so i can access backend from different ports
app.use(cors({origin: "*",}))



// serve static files from the public directory
app.use(express.static('public'));



// connect to mongodb
mongoose.connect('mongodb://127.0.0.1/BETAAAA',{ useUnifiedTopology: true, useNewUrlParser: true })
        .then(()=>console.log('connecting to database..'))
        .catch(e => console.error('could not connect to database..',e));

// middleware
app.use(express.json());

app.use(express.static('public'));

// routes
app.use('/api/user/', users);
app.use('/api/', home);
app.use('/api/devices', devicesRouter);

// port config.      
const port = process.env.PORT || 4000;
app.listen(port,()=>console.log(`Listening on port ${port} ...`));
