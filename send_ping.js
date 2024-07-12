const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
    console.log("Ping route hit");
    res.end();
});

module.exports = router;