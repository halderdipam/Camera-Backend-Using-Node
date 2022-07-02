// importing mongoose & config :-
const mongoose = require('mongoose');
const config = require('../config/default.json');

// DB connection :-
mongoose.connect(config.paths.dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
})
    .then(() => console.log('Connected to the MongoDb..'))
    .catch((err) => console.error('Could not connect to MongoDb..'));

// exporting mongoose :-
module.exports = mongoose;
