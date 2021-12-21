var express = require('express');
var cors = require('cors')
var app = express();

const fs = require('firebase-admin');

const serviceAccount = require('./firebase/bankofseamless-firebase-adminsdk-uzixj-02d0a5a7d4.json')

const userRoute = require('./routes/user')

balance = process.env.BALANCE
const port = process.env.PORT || 2400

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Pass to next layer of middleware
    next();
})

app.use('/api/v1', userRoute)
app.listen(port, function () {
    console.log(`Seamless listening on port ${port}!`);
});