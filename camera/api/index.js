// importing all functions :-
const { createCameras } = require('./post');
const { getAllCameras, getSpecificCamera } = require('./get');
const { updateCameras } = require('./put');

// exporting all functions :-
module.exports = {
    createCameras, updateCameras, getAllCameras, getSpecificCamera,
};
