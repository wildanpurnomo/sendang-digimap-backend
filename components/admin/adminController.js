const AdminModel = require('./adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

exports.fetchAllAdmins = async (req, res, next) => {
    try {
        let fetchedAdmins = await AdminModel.find({}).select('-password').exec();
        res.status(200).send(fetchedAdmins);
    } catch (err) {
        next(err);
    }
}

exports.fetchAdminById = async (req, res, next) => {
    try {
        let fetchedAdmin = await AdminModel.findOne({ _id: req.params.id }).select('-password').exec();
        res.status(200).send(fetchedAdmin);
    } catch (err) {
        next(err);
    }
}

exports.updateAdmin = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(401).json({ error: "Data tidak bisa kosong." });
        }

        // check if username exists in request
        // if yes, update the username
        if (req.body.username) {
            await AdminModel.updateOne({ _id: req.params.id }, { $set: { username: req.body.username } });
        }

        let fetchedAdmin = await AdminModel.findOne({ _id: req.params.id });

        // check if oldPassword exists in request
        // if yes, update the password
        if (req.body.oldPassword) {
            // validate old password
            let result = await bcrypt.compare(req.body.oldPassword, fetchedAdmin.password);
            if (result) {
                let hash = await bcrypt.hash(req.body.newPassword, saltRounds);
                if (hash) {
                    fetchedAdmin.password = hash;
                    await fetchedAdmin.save();
                }
            } else {
                res.status(401).json({ error: "Password Salah" });
                return;
            }
        }
        res.status(200).json({
            userId: fetchedAdmin._id,
            username: fetchedAdmin.username,
        });
    } catch (err) {
        next(err);
    }
}

exports.createAdmin = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(401).json({ error: "Data tidak bisa kosong." });
        }
        let admin = req.body;
        let hash = await bcrypt.hash(admin.password, saltRounds);

        if (hash) {
            admin.password = hash;
            let createdAdmin = await AdminModel.create(admin);
            delete createdAdmin.password;
            res.status(200).send(createdAdmin);
        }
    } catch (err) {
        next(err);
    }
}

exports.delete = async (req, res, next) => {
    try {
        let deleted = await AdminModel.deleteOne({_id: req.params.id});
        if (deleted) {
            res.status(200).send(deleted);
        } else {
            res.status(401).json({error: 'Terdapat masalah'});
        }
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(401).json({ error: "Data tidak bisa kosong." });
        }
        let username = req.body.username;
        let password = req.body.password;
        let fetchedAdmin = await AdminModel.findOne({ username: username });

        if (fetchedAdmin != null) {
            if (!fetchedAdmin.isLoggedIn) {
                let result = await bcrypt.compare(password, fetchedAdmin.password);
                if (result) {
                    jwt.sign({ data: fetchedAdmin.username }, 'secret', async (err, token) => {
                        fetchedAdmin.isLoggedIn = true;
                        await fetchedAdmin.save();
                        res.status(200).json({
                            userId: fetchedAdmin._id,
                            username: fetchedAdmin.username,
                            token: token,
                        });
                    });
                } else {
                    res.status(401).json({ error: "Salah" });
                }
            } else {
                res.status(401).json({ error: "Sudah Login" });
            }
        } else {
            res.status(404).json({
                error: "Salah"
            });
        }
    } catch (err) {
        next(err);
    }
}

exports.logout = async (req, res, next) => {
    try {
        let fetchedAdmin = await AdminModel.findOneAndUpdate({ _id: req.params.id }, { $set: { isLoggedIn: false } }).select('-password');
        fetchedAdmin.isLoggedIn = false;
        res.status(200).send(fetchedAdmin);
    } catch (err) {
        next(err);
    }
}