const { Login,
     Registration,
     ForgotPassword,
     VerifyOtp,
     ResetPassword, 
     Logout } = require("../Controller/auth.controler");

const { authenticateToken } = require('../middleware/JwtMiddleware.js') // not used
module.exports = app => {
     app.post("/api/registration", Registration);
     app.post("/api/login", Login);
     app.post("/api/forgotpassword", ForgotPassword);
     app.post("/api/verifyotp", VerifyOtp);
     app.post("/api/resetpassword", ResetPassword);
     app.post("/api/logout", Logout);
};
