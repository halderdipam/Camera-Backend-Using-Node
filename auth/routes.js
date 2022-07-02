// importing libraries,middlewares & function :-
const { Router } = require('express');

const authRouter = Router();
const {
    verifyUserToken, verifyAdmin, verifyAdminUserQA, verifyAllUserActive,
} = require('../middlewares/userAuth');
const {
    registerAuthAdmin, registerUser, loginAuthUser, updateUserStatus, updatePassword, updateUsers, deleteUsers, getAllUsers,
} = require('./api/index');

// defining routes :-
authRouter.post('/register', registerAuthAdmin);
authRouter.post('/login', loginAuthUser);
authRouter.get('/allusers', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, getAllUsers);
authRouter.put('/changepassword', verifyUserToken, verifyAllUserActive, verifyAdminUserQA, updatePassword);
authRouter.post('/adduser', verifyUserToken, verifyAllUserActive, verifyAdmin, registerUser);
authRouter.put('/update/:id', verifyUserToken, verifyAllUserActive, verifyAdmin, updateUsers);
authRouter.put('/updatestatus/:id', verifyUserToken, verifyAllUserActive, verifyAdmin, updateUserStatus);
authRouter.put('/updaterole/:id', verifyUserToken, verifyAllUserActive, verifyAdmin);
authRouter.delete('/delete/:id', verifyUserToken, verifyAllUserActive, verifyAdmin, deleteUsers);

// exporting authRouter :-
module.exports = { authRouter };
