const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');

router.get('/', processController.getAllProcesses);

module.exports = router;