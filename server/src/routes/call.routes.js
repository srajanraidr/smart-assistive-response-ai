const express = require('express');;
const router = express.Router();
const uploadfile = require('../middleware/upload.middleware');

const {uploadAudio} = require('../controllers/call.controller');

router.post("/upload",uploadfile.single("audio"),uploadAudio);

module.exports = router;