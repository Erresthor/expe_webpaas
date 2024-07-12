const express = require('express');
const router = express.Router();

router.get('/user', (req, res) => {
    console.log("User route hit");
    res.end();
});

module.exports = router;