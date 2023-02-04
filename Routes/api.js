const express = require('express');
const {HomePage,AddPage, Add, View} = require('../Controller/HomeController')
const router = express.Router();

router.get('/', HomePage);
router.get('/add', AddPage);
router.post('/add', Add);
router.get('/view/:id', View);

module.exports = router;