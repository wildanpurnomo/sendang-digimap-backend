const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const adminRouter = require('./components/admin/adminRouter');
const venueRouter = require('./components/venue/venueRouter');
const mongoDBUrl = process.env.MONGODB_URI || "mongodb://localhost/sendangdigimap";

// connect to DB
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useUnifiedTopology: true }, (err) => {
    if (err) {
        throw err;
    } else {
        console.log("Connected to MongoDB");
    }
});

mongoose.Promise = global.Promise;

// iki opo mboh
app.set('trust proxy', true);

// use bodyparser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// use cors middleware
app.use(cors());

// assign routers
app.use('/api', adminRouter);
app.use('/api', venueRouter);

// error handling middleware
app.use((err, req, res, next) => {
    res
        .status(422)
        .send({
            error: `Error: ${err.message}`,
        });
});

// listen to port
app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + 3000);
});