const express = require('express');

const app = express();

app.get('/', (req,res) => {

})

app.get('/login', async (req,res) => {
    let email = req.body.email;
    let password = req.body.password;



})

app.listen(3000);


