// importing User model :-
const jwt = require('jsonwebtoken');
const { User } = require('../../db/index');
const config = require('../../config/default.json');

// defining AuthService :-
class AuthService {
    // checking user/admin/QA :-
    static async validUser(email) {
        return await User.findOne({
            email,
        });
    }

    // checking if the user/admin/QA exists in DB-user collection or not :-
    static async checkUserId(id) {
        return await User.findOne({
            _id: id,
        });
    }

    // creating user/admin/QA :-
    static async createUser(user) {
        return await User.create(
            user,
        );
    }

    // getting all users/admins/QAs :-
    static async getAllUsers(offset, limit) {
        return await User.find().skip(offset).limit(limit);
    }

    // getting all users/admins/QAs count :-
    static async getAllUsersCount() {
        return await User.find().countDocuments();
    }

    // updating user/admin/QA details :-
    static async updateUser(id, body) {
        return await User.updateOne({ _id: id }, { $set: body });
    }

    // delete user/admin/QA :-
    static async deleteUser(id) {
        return await User.findByIdAndDelete({ _id: id });
    }

    // updating user/admin/QA password :-
    static async updateNewPassword(email, body) {
        return await User.updateOne({ email }, { $set: body });
    }

    // getting jwt token of the user/admin/QA :-
    static jwtToken(user) {
        const token = jwt.sign(
            {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                role: user.role,
                isActive: user.isActive,
            },
            config.privateKey,
            {
                expiresIn: '7d',
            },
        );
        return token;
    }
}

// exporting AuthService :-
module.exports = AuthService;
