const express = require('express');
const router = express.Router();
const controller = require('./venueController');
const multer = require('multer');
const GridfsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const mongoDBUrl = process.env.MONGODB_URI || "mongodb://localhost/sendangdigimap";
const storage = new GridfsStorage({
    url: mongoDBUrl,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }

                if (Object.keys(req.body).length === 0) {
                    console.log("kosong");
                    return reject(new Error("Can't"));
                }

                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads',
                }
                req.body.imageURL = filename;
                resolve(fileInfo);
            })
        })
    },
});
const upload = multer({ storage });

router.post('/venue', upload.single('img'), controller.createVenue);

router.get('/venue', controller.fetchAllVenues);

router.get('/venue/:venueId', controller.fetchVenueById);

router.get('/venue/img/:filename', controller.getImage);

router.put('/venue/:venueId', upload.single('img'), controller.editVenue);

router.delete('/venue/:venueId', controller.deleteVenue);

module.exports = router;


