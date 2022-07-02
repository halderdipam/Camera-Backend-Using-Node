// import libraries, config & functions :-
const nodemailer = require('nodemailer');
const { DateTime } = require('luxon');
const { todaysAlertProcessing } = require('./alertEmailsService');
const config = require('../../config/default.json');

const emailSubject = config.reportEmailCredential.subjectOfEmail;

// defining ReportEmailService :-
class ReportEmailService {
    // getting all-emails to be send :-
    static async getAllTodaysAlerts() {
        const alertsProcessing = await todaysAlertProcessing();
        return alertsProcessing;
    }

    // getting all-emails count to be send :-
    static async allAlertEmailCount(allEmails) {
        if (allEmails.length === 0) return 0;
        let emailCount = 0;
        for (let i = 0; i < allEmails.length; i++) {
            const e = allEmails[i];
            Object.keys(e).forEach((key) => {
                const allValues = e[key];
                for (let k = 0; k < allValues.length; k++) {
                    emailCount += allValues[k].count;
                }
            });
        }
        return emailCount;
    }

    // sending email by this function :-
    static async sendMail(textData, emailCount) {
    // making email data dynamic before sending :-
        let dynamicData = textData.map((item, index) => {
            const keys = Object.keys(item);
            const values = keys && item[keys];

            // getting one day previous date for the email :-
            const fullDate = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).endOf('day')
                .toISO()
                .slice(0, 10);

            // returning email data :-
            return `<ul><b><a href=http://${config.paths.alertEmailPath}/admin/alert-list?startDate=${fullDate},endDate=${fullDate},action_Id=${values[0].action_Id}> ${index + 1}.  ${keys}</b> ${(values && values.length) ? values.map((ele) => `<li style='margin-left: 40px'><a href=http://${config.paths.alertEmailPath}/admin/alert-list?startDate=${
                fullDate},endDate=${fullDate},camera_Id=${ele.camera_Id},action_Id=${
                ele.action_Id}>${ele.camera_Name},(Count:- ${ele.count})</li>`).join('') : ''}</ul>`;
        }).join('');

        // checking the email data is empty or not :-
        if (dynamicData.length === 0) {
            // if email data is empty then send onlt this sentence as the email data :-
            dynamicData = '<p><b>No Alerts Generated Today.</b></p>';
        } else {
            // if email data is not empty then addding this sentence with the email data :-
            dynamicData = `<p><b>Total Alerts Generated Today - </b></p>${dynamicData}`;
        }

        // getting previous day date and modifying the email-subject :-
        const yesterdayDate = DateTime.now().setZone('Asia/Kolkata').minus({ days: 1 }).endOf('day')
            .toISO()
            .slice(0, 10);
        const modifiedYesterdayDate = `${yesterdayDate.slice(8, 10)}-${yesterdayDate.slice(5, 7)}-${yesterdayDate.slice(0, 4)}`;
        const modifiedEmailSubject = `${emailSubject} || (Count:- ${emailCount}) || Date:- ${modifiedYesterdayDate}`;

        // defining email transporter :-
        const transporter = nodemailer.createTransport({
            service: config.reportEmailCredential.emailServerHost,
            auth: {
                user: config.reportEmailCredential.emailServerId,
                pass: config.reportEmailCredential.emailServerPassword,
            },
        });

        // defining mailOptions :-
        const mailOptions = {
            from: config.reportEmailCredential.emailServerId,
            to: config.reportEmailCredential.receiverEmailId,
            subject: modifiedEmailSubject,
            html: dynamicData,
        };

        // sending email by transporter :-
        await transporter.sendMail(mailOptions, (error, info) => {
            // if error comes print the error in console :-
            if (error) {
                console.log(error);
            } else {
                // printing the message response if email has sent succesfully :-
                console.log(`Email sent: ${info.response}`);
            }
        });
    }
}

// exports ReportEmailService :-
module.exports = ReportEmailService;

// // people email-list to be sent email ( just keeping the list here ) :-
// "singh.nitin@tftus.com",
// "roy.rahul@tftus.com",
// "gupta.prabal@tftus.com",
// "ahsan.umer@tftus.com",
// "jacob.winil@tftus.com",
// "it@troikaapharma.com",
// "gupta.prakhar@tftus.com",
// "hitesh-it@troikaapharma.com",
// "hiren@troikaapharma.com"
