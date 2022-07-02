// import AuthService :-
const AuthService = require('../services/index');

// this function will give all-users ( user/admin/QA ) :-
const getAllUsers = async (req, res) => {
    // page & limit for pagination :-
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const offset = page ? page * limit : 0;

    try {
    // getting all-users ( user/admin/QA ) :-
        const allUsers = await AuthService.getAllUsers(offset, limit);
        const totalUsers = await AuthService.getAllUsersCount();
        const totalPages = Math.ceil(totalUsers / limit);

        // sending response :-
        return res.status(200).send({ success: true, payload: { AllUsers: allUsers, TotalUsers: totalUsers, TotalPages: totalPages } });
    } catch (e) {
    // if error comes then sending the error as response as well as print the error in console :-
        console.log(e);
        res.status(500).send({
            message: 'Error -> Can NOT complete a paging request!',
            error: e.message,
        });
    }
};

// exporting the getAllUsers :-
module.exports = { getAllUsers };
