const express = require('express');
const {HomePage,AddPage, Add, View, Edit, EditPage, DeletePage, Delete} = require('../Controller/HomeController')
const router = express.Router();

router.get('/', HomePage);
router.get('/add', AddPage);
router.post('/add', Add);
router.get('/view/:id', View);
router.get('/edit/:id', EditPage);
router.get('/delete/:id', DeletePage);
router.post('/delete', Delete);

module.exports = router;