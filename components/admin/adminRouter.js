const express = require('express');
const router = express.Router();
const controller = require('./adminController');

router.get('/admin', controller.fetchAllAdmins);

router.get('/admin/:id', controller.fetchAdminById);

router.post('/admin', controller.createAdmin);

router.put('/admin/:id', controller.updateAdmin);

router.post('/admin/login', controller.login);

router.put('/admin/logout/:id', controller.logout);

router.delete('/admin/delete/:id', controller.delete);

module.exports = router;