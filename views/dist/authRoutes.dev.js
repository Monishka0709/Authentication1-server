"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authController = require("../controllers/authController.js");

var _userAuth = _interopRequireDefault(require("../middleware/userAuth.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authRouter = _express["default"].Router();

authRouter.post('/register', _authController.register);
authRouter.post('/login', _authController.login);
authRouter.post('/logout', _authController.logout);
authRouter.post('/sendVerifyOtp', _userAuth["default"], _authController.sendVerifyOtp);
authRouter.post('/verifyAccount', _userAuth["default"], _authController.verifyAccount);
authRouter.get('/isAuthenticated', _userAuth["default"], _authController.isAuthenticated);
authRouter.post('/sendResetPasswordOtp', _authController.sendResetPasswordOtp);
authRouter.post('/resetPassword', _authController.resetPassword);
var _default = authRouter;
exports["default"] = _default;