const express = require('express');
const mongoose = require('mongoose');
const RTDataRouter = require('./routes/realTimeSensorController');
const app = express();
const cors = require('cors');
require("dotenv").config();

// Connect to MongoDB database
async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE, {
            maxPoolSize: 20     
        });
        console.log('Connected with MongoDB');
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
    }
}

connect(); 

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/RTdata', RTDataRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
