require('dotenv').config({ path: './.env' })
const express = require('express');

const PORT = 9000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
require('./src/auth/session')(app);
require('./src/auth/google')(app);
require('./src/auth/github')(app);
require('./src/auth/local')(app);

app.listen(PORT, () => { console.log("Up and running"); });
