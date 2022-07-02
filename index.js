/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
// importing libraries :-
const express = require('express');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dbMongo = require('./db/mongoose');
const db = require('./db');
const socketIo = require('./socketio/index');
const { router } = require('./routes');

// using cors :-
const corsOptions = {
    exposedHeaders: 'Authorization',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'),
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'),
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// using morgan :-
morgan.token('id', (req) => req.id);
morgan.token('param', (req, res, next) => 'userToken');
app.use(assignid);
app.use(morgan(':id:param:method:status:url"HTTP/:http-version"'));

// home route :-
app.get('/', (req, res) => {
    res.send({ data: 'This is the Home Page' });
});

app.use('/', router);

function assignid(req, res, next) {
    req.id = uuidv4();
    next();
}

// defining port :-
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listing on port ${port}..`));
