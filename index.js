const express = require('express');
const app = express();
const port = 3000;
// const ejs = require('ejs');
const router = require('./Routes/api.js');
app.set('views', './Views');
app.set('View Engine', 'ejs');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



app.use('/', router);
app.use('/public', express.static('public'));

app.listen(port, function (){
    console.log(`http://localhost:${port}`);
})