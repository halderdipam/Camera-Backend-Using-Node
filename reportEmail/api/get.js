// import ReportEmailService & libraries:-
const cron = require('node-cron');
const ReportEmailService = require('../services/index');

// sending email by node-cron by this function :-
const cronSendEmail = async (req, res) => {
    // getting email data to be send and its count :-
    const textData = await ReportEmailService.getAllTodaysAlerts();
    const emailCount = await ReportEmailService.allAlertEmailCount(textData);

    // getting email :-
    const email = await ReportEmailService.sendMail(textData, emailCount);
};

// this function is for sending the email manually by hitting an api :-
const emailSend = async (req, res) => {
    try {
    // getting email data to be send and its count :-
        const textData = await ReportEmailService.getAllTodaysAlerts();
        const emailCount = await ReportEmailService.allAlertEmailCount(textData);

        // getting email :-
        const email = await ReportEmailService.sendMail(textData, emailCount);

        // sending response :-
        return res.status(200).send({ success: true, message: 'Email has been Sent Successfully.' });
    } catch (e) {
    // if error comes then sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({
            message: 'Cannot able to send Email.',
        });
    }
};

// scheduling the email at 12 pm to be sent by node-cron:-
cron.schedule('0 12 * * *', () => {
    cronSendEmail();
});

// exporting the emailSend :-
module.exports = { emailSend };
