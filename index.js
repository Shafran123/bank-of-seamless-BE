var express = require('express');
var cors = require('cors')
var app = express();

const userRoute = require('./routes/user')

balance = process.env.BALANCE

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

app.listen(2400, function () {
    console.log('Seamless listening on port 2400!');
});