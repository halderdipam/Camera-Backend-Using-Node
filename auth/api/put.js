// import AuthService,functions & libraries :-
const bcrypt = require('bcrypt');
const AuthService = require('../services/index');
const { validateUserChangePassword, validateUserUpdate, validateUserStatusUpdate } = require('../validation/validate');
const auth = require('../../middlewares/auth');

// this function will update password of the user/admin :-
const updatePassword = async (req, res) => {
    // validating the change password details of the user/admin/QA :-
    const { error } = validateUserChangePassword(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    try {
    // getting the user/admin/QA email from token :-
        const { email } = auth(req);
        const isValidUser = await AuthService.validUser(email.trim());
        if (!isValidUser) return res.status(404).json({ message: 'User/Admin/QA is not registered.' });

        // encrypting the password :-
        const password = req.body.oldPassword;
        const isValidPassword = await bcrypt.compareSync(password, isValidUser.password);

        // checking if the new password and confirm new password is matching or not :-
        if (req.body.newPassword !== req.body.confirmNewPassword) {
            return res.status(404).json({ message: 'New Password and Confirm New Password is not matching.' });
        }

        // checking if previous password and new password & confirm new password is matching or not :-
        if (isValidPassword === true && req.body.newPassword === req.body.confirmNewPassword) {
            const salt = await bcrypt.genSalt(10);
            const bcryptPassword = await bcrypt.hash(req.body.newPassword, salt);

            // taking password :-
            const updatedPassword = {
                password: bcryptPassword,
            };

            // updating the password of the user/admin/QA and sending response :-
            const changedPassword = await AuthService.updateNewPassword(email, updatedPassword);
            return res.status(200).send({ success: true, message: 'New Password has been successfully Updated for this user.' });
        }

        // sending response :-
        return res.status(404).send({ message: 'This Current Password is not matching with the Old Password of the User.' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        return res.status(500).send({ success: false, exception: e.message });
    }
};

// this function will update user/QA/admin by admin :-
const updateUsers = async (req, res) => {
    // validating the details of the admin/user/QA :-
    const { error } = validateUserUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    try {
    // checking the user/QA/admin is registered or not :-
        const notUpdateUser = await AuthService.checkUserId(req.params.id);
        if (notUpdateUser === null) {
            return res.status(404).send({ message: 'This User/QA/Admin is not Registered.' });
        }

        // defining three user roles to be updated :-
        const userRoles = ['admin', 'user', 'QA'];

        // checking the user role because only user/admin/QA user role is allowed to be updated :-
        if (userRoles.includes(req.body.role) === false) {
            return res.status(404).send({ message: 'This User-role is not allowd to be Updated.' });
        }

        // taking user/QA/admin details :-
        const userDetails = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
        };

        // if the admin not updating himself/herself then adding the role into the userDetails object :-
        const { id } = auth(req);
        if (req.params.id !== id) {
            userDetails.role = req.body.role;
        }

        // updating user/QA/admin details and sending response :-
        const updateUserDetails = await AuthService.updateUser(req.params.id, userDetails);
        return res.status(200).send({ success: true, message: 'User/QA/Admin Details has been successfully Updated' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        return res.status(404).send({ success: false, exception: e.message, message: 'This User/QA/Admin email is already Registered.' });
    }
};

// this function will update user/QA/admin status by admin :-
const updateUserStatus = async (req, res) => {
    // validating the details of the admin/user/QA status :-
    const { error } = validateUserStatusUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    try {
    // checking the user/QA/admin is registered or not :-
        const notUpdateUserStatus = await AuthService.checkUserId(req.params.id);
        if (notUpdateUserStatus === null) {
            return res.status(404).send({ message: 'This User/QA/Admin is not Registered.' });
        }

        // admin cannot disable himself/herself :-
        const { id } = auth(req);
        if (req.params.id === id) {
            return res.status(404).send({ message: 'You Cannot Disable Yourself.' });
        }

        // checking and coverting the string values to the boolean values :-
        let userStatus = '';
        if (req.body.isActive === 'true') {
            userStatus = true;
        } else if (req.body.isActive === 'false') {
            userStatus = false;
        } else {
            return res.status(404).send({ message: 'The User Status Modification can be done either \'true\' or \'false\' in String.' });
        }

        // taking user status to be updated :-
        const userDetails = {
            isActive: userStatus,
        };

        // updating user/QA/admin status and sending response :-
        const updateUserDetails = await AuthService.updateUser(req.params.id, userDetails);
        return res.status(200).send({ success: true, message: 'User/QA/Admin Status has been successfully Updated' });
    } catch (e) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(e);
        return res.status(500).send({ success: false, exception: e.message });
    }
};

// exporting the functions :-
module.exports = { updatePassword, updateUsers, updateUserStatus };
