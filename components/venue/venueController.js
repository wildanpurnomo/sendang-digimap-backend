const VenueModel = require('./venueModel');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const mongoDBUrl = process.env.MONGODB_URI || "mongodb://localhost/sendangdigimap";

const conn = mongoose.createConnection(mongoDBUrl);
let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("GFS Connected");
});

exports.createVenue = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new Error("Can't");
        }
        req.body.location = JSON.parse(req.body.location);
        let created = await VenueModel.create(req.body);
        res.status(200).send(created);
    } catch (err) {
        next(err);
    }
}

exports.fetchAllVenues = async (req, res, next) => {
    try {
        let fetchedVenues = await VenueModel.find({}).exec();
        res.status(200).send(fetchedVenues);
    } catch (err) {
        next(err);
    }
}

exports.fetchVenueById = async (req, res, next) => {
    try {
        let fetchedVenue = await VenueModel.findOne({ _id: req.params.venueId });
        if (!fetchedVenue || fetchedVenue.length === 0) {
            res.status(404).json("No data found");
        } else {
            res.status(200).send(fetchedVenue);
        }
    } catch (err) {
        next(err);
    }
}

exports.getImage = async (req, res, next) => {
    try {
        let fetchedImage = await gfs.files.findOne({ filename: req.params.filename });
        if (!fetchedImage || fetchedImage.length === 0) {
            res.status(404).send("No Image Found");
        }

        if (fetchedImage.contentType === 'image/jpeg' || fetchedImage.contentType === 'image/png') {
            const readstream = gfs.createReadStream(fetchedImage.filename);
            readstream.pipe(res);
        }
    } catch (err) {
        next(err);
    }
}

exports.editVenue = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new Error("Can't");
        }

        req.body.location = JSON.parse(req.body.location);
        let updated = await VenueModel.updateOne({ _id: req.params.venueId }, { $set: req.body });
        res.status(200).send(updated);
    } catch (err) {
        next(err);
    }
}

exports.deleteVenue = async (req, res, next) => {
    try {
        let deleted = await VenueModel.deleteOne({ _id: req.params.venueId });
        if (deleted) {
            res.status(200).send(deleted);
        } else {
            res.status(401).json({error: 'Terdapat masalah'});
        }
    } catch (err) {
        next(err);
    }
}