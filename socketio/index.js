/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
// importing libraries & services :-
const io = require('socket.io')(8001, {
    cors: {
        origin: '*',
    },
});
const socketAlertService = require('./services/index');

// taking global variables :-
let date = new Date();
global.sampleTime = new Date(date.setDate(date.getDate() - 1));
global.countAlertModification = 0;

// getting the latest alert timing by node-cron by this function :-
const cronLatestAlertTiming = async (socket) => {
    const latestAlertTiming = await socketAlertService.latestAlertTime();

    // checking if latest alert time is newer than the previously-latest alert time :-
    if (latestAlertTiming > sampleTime) {
        countAlertModification += 1;
        if (countAlertModification > 1) {
            console.log('New Alerts Created.');
            io.emit('newAlert', 'New Alerts Created.');
        }
    }
    sampleTime = latestAlertTiming;
};

// connecting the socket-io :
io.on('connection', (socket) => {
    console.log('Socket-Io Connected.', socket.id);

    // checking if the socket-io got connected or not :-
    if (socket.connected) {
        // checking new alerts are generated or not after every second :-
        setInterval(() => cronLatestAlertTiming(socket), 1000);
    }

    // disconnecting the socket-io :-
    socket.on('disconnect', () => {
        console.log('Socket-Io Disconnected.');
    });
});
