// importing AlertService & functions :-
const AlertService = require('../services/index');
const { validateAlertUpdate } = require('../validation/validate');

// this function will update alerts :-
const updateAlertStatus = async (req, res) => {
    try {
    // validating alert details :-
        const { error } = validateAlertUpdate(req.body);
        if (error) return res.status(404).send(error.details[0].message);

        // alert uuid which is not present in alert collection can not be updated :-
        const notUpdateAlert = await AlertService.checkAlertId(req.params.id);
        if (notUpdateAlert === null) {
            return res.status(404).send({ message: 'This Alert is not Present.' });
        }

        // updated alert false_Positive must be either true or false :-
        const alertModify = ['false', 'true'];
        if (alertModify.includes(req.body.false_Positive) === false) {
            return res.status(404).send({ message: 'The Alert Modification can be done either \'true\' or \'false\' in String.' });
        }

        // taking alert details to be updated :-
        const alertDetails = {
            false_Positive: req.body.false_Positive,
        };

        // updating alert and sending response :-
        const updateAlertDetails = await AlertService.updateAlert(req.params.id, alertDetails);
        res.status(200).send({ success: true, message: 'Alert Status has been successfully Updated' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({ success: false, exception: e.message });
    }
};

// exporting the updateAlert :-
module.exports = { updateAlertStatus };
