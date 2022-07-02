// importing AuthService,libraries & middlewares :-
const bcrypt = require('bcrypt');
const jwt_decode = require('jwt-decode');
const AuthService = require('../services/authService');
const { validateAdmin, validateUserRegister, validateUserLogin } = require('../validation/validate');
const { getRole } = require('../utilities/index');

// user (admin) Register :-
const registerAuthAdmin = async (req, res) => {
    // check if the user (admin) is admin or not :-
    const getNewRole = getRole(req.query.role);
    if (getNewRole !== 'admin') {
        return res.status(404).send({ message: 'Only Admin can access this Page.' });
    }

    // validating user (admin) details :-
    const { error } = validateAdmin(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    try {
    // checking the user (admin) is already exists in DB user collection or not :-
        const eml = req.body.email;
        const email = eml.toLowerCase();
        const isValidUser = await AuthService.validUser(email.trim());
        if (isValidUser) return res.status(404).send({ message: 'This Admin is already registered.' });

        // encrypting the user (admin) password :-
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        // taking user (admin) details :-
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email,
            password,
            role: 'admin',
        };

        // creating user (admin) & jwtToken :-
        const createUser = await AuthService.createUser(user);
        const jwtToken = await AuthService.jwtToken(createUser);

        // sending response :-
        return res.status(200).header('Authorization', jwtToken).send({ success: true, payload: createUser, message: 'Added New user ( Admin ).' });
    } catch (err) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(err);
        return res.status(500).send({ success: false, exception: err.message });
    }
};

// add user by admin ( admin can add other admins,users & QA ):-
const registerUser = async (req, res) => {
    // validating user/admin/QA details :-
    const { error } = validateUserRegister(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
    // checking the user/admin/QA is already exists in DB user collection or not :-
        const eml = req.body.email;
        const email = eml.toLowerCase();
        const isValidUser = await AuthService.validUser(email.trim());
        if (isValidUser) return res.status(404).send({ message: 'This User/Admin/QA is already registered.' });

        // encrypting the user/admin/QA password :-
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        // defining three user roles to be updated :-
        const userRoles = ['admin', 'user', 'QA'];

        // checking the user role because only user/admin/QA user role is allowed to be updated :-
        if (userRoles.includes(req.body.role) === false) {
            return res.status(404).send({ message: 'This User-role is not allowd to be Registered.' });
        }

        // taking user/admin/QA details :-
        const user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email,
            password,
            role: req.body.role,
        };

        // creating user/admin/QA & jwtToken :-
        const createUser = await AuthService.createUser(user);
        const jwtToken = await AuthService.jwtToken(createUser);

        // sending response :-
        return res.status(200).header('Authorization', jwtToken).send({ success: true, payload: createUser, message: 'User/Admin/QA Added.' });
    } catch (err) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(err);
        return res.status(500).send({ success: false, exception: err.message });
    }
};

// admin/user/QA login :-
const loginAuthUser = async (req, res) => {
    // validating admin/user/QA details :-
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    try {
    // encrypting the admin/user/QA password :-
        const { password } = req.body;

        // checking the admin/user/QA is exists in DB user collection or not :-
        const em = req.body.email;
        const email = em.toLowerCase();
        const isValidUser = await AuthService.validUser(email.trim());
        if (!isValidUser) return res.status(404).send({ msg: 'This User/Admin/QA is not registered' });

        // checking the admin/user/QA password is right or not :-
        const isValidPassword = await bcrypt.compareSync(password, isValidUser.password);
        if (!isValidPassword) res.status(404).send({ msg: 'Unauthorized Access. Wrong Password.' });

        // sending jwt token and email of the admin/user/QA as response :-
        const jwtToken = AuthService.jwtToken(isValidUser);
        if (!jwtToken) {
            return res.status(404).send({
                success: false,
                msg: 'Login Failed. Please Try Again Later!',
            });
        }

        // checking the admin/user/QA status is active or not :-
        const { isActive } = jwt_decode(jwtToken);
        if (isActive !== true) return res.status(404).send({ msg: 'You are not an Active User for Login into the System.' });

        // sending the token :-
        return res.status(200).header('Authorization', jwtToken).send({
            success: true,
            payload: isValidUser.email,
            role: isValidUser.role,
        });
    } catch (err) {
    // if error comes sending the error as response as well as print the error in console :-
        console.log(err);
        return res.status(500).send({ success: false, exception: err.message });
    }
};

// exporting the functions :-
module.exports = { registerAuthAdmin, registerUser, loginAuthUser };
