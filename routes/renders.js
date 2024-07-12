const express = require('express')
const router = express.Router()

// ROUTING REQUESTS 
router.get('/:var(|fr|Fr|FR)', function(req, res){
    res.render('homepage_subject.html', {root: __dirname});
});

router.get('/:var(en|En|EN)', function(req, res){
    res.render('homepage_subject_en.html', {root: __dirname});
});

router.get('/:var(e|E)', function(req, res){
    res.render('test_page.html', {root: __dirname});
});

router.get('/fullscreen_master', function(req, res){
    res.render('fullscreen_master.html');
});

router.get('/about', function(req, res){
    res.render('about.html');
});

module.exports = router