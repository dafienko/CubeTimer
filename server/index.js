require('dotenv').config({ path: './.env' })
const express = require('express');

const PORT = 9000;
const app = express();

app.use(require('cors')({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
require('./src/routes/auth/session')(app);
require('./src/routes/auth/google')(app);
require('./src/routes/auth/github')(app);
require('./src/routes/auth/local')(app);
require('./src/routes/user')(app);

app.listen(PORT, () => { console.log("Up and running"); });
