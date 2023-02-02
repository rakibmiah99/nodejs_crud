const express = require('express');
const {HomePage,AddPage, Add} = require('../Controller/HomeController')
const router = express.Router();

router.get('/', HomePage);
router.get('/add', AddPage);
router.post('/add', Add);

module.exports = router;