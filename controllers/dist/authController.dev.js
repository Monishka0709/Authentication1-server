"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPassword = exports.sendResetPasswordOtp = exports.isAuthenticated = exports.verifyAccount = exports.sendVerifyOtp = exports.logout = exports.login = exports.register = void 0;

var _userModel = _interopRequireDefault(require("../models/userModel.js"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _nodemailer = _interopRequireDefault(require("../config/nodemailer.js"));

var _emailTemplates = require("../config/emailTemplates.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var register = function register(req, res) {
  var _req$body, name, email, password, existingUser, hashedPassword, user, token, mailOptions;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password;

          if (!(!name || !email || !password)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: 'Please fill all the fields'
          }));

        case 3:
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 6:
          existingUser = _context.sent;

          if (!existingUser) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            success: false,
            message: 'User already exists'
          }));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, 10));

        case 11:
          hashedPassword = _context.sent;
          user = new _userModel["default"]({
            name: name,
            email: email,
            password: hashedPassword
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(user.save());

        case 15:
          token = _jsonwebtoken["default"].sign({
            id: user._id
          }, process.env.JWT_SECRET, {
            expiresIn: '7d'
          });
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

          }); //Sending welcome email to the user

          mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to our platform',
            text: "Hello ".concat(user.name, ",\n\nThank you for registering on our platform. We're excited to have you on board!\n\nBest regards,\nThe Team")
          };

          _nodemailer["default"].sendMail(mailOptions, function (err, info) {
            if (err) {
              console.error(err);
              return res.status(500).json({
                success: false,
                message: 'Email failed to send'
              });
            }

            console.log("Welcome email sent successfully");
            res.status(201).json({
              success: true,
              message: 'User registered successfully',
              token: token
            });
          });

          _context.next = 25;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](3);
          console.log(_context.t0);
          res.json({
            success: false,
            message: _context.t0.message
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 21]]);
};

exports.register = register;

var login = function login(req, res) {
  var _req$body2, email, password, user, isMatch, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;

          if (!(!email || !password)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            success: false,
            message: 'Email and password are required'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 6:
          user = _context2.sent;

          if (user) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            success: false,
            message: 'User not found'
          }));

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 11:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.status(401).json({
            success: false,
            message: 'Incorrect password'
          }));

        case 14:
          token = _jsonwebtoken["default"].sign({
            id: user._id
          }, process.env.JWT_SECRET, {
            expiresIn: '7d'
          });
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
          });
          return _context2.abrupt("return", res.json({
            success: true,
            message: 'Login successful'
          }));

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          return _context2.abrupt("return", res.status(500).json({
            success: false,
            message: 'Server error'
          }));

        case 23:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.login = login;

var logout = function logout(req, res) {
  return regeneratorRuntime.async(function logout$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
          });
          return _context3.abrupt("return", res.json({
            success: true,
            message: 'Logout successful'
          }));

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.json({
            success: false,
            message: _context3.t0.message
          }));

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

exports.logout = logout;

var sendVerifyOtp = function sendVerifyOtp(req, res) {
  var userId, user, otp, mailOptions;
  return regeneratorRuntime.async(function sendVerifyOtp$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.userId;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findById(userId));

        case 4:
          user = _context4.sent;

          if (!user.isVerified) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.json({
            success: false,
            message: 'User is already verified'
          }));

        case 7:
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          user.verifyOtp = otp;
          user.verifyOtpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

          _context4.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your OTP for account verification',
            html: _emailTemplates.EMAIL_VERIFY_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp)
          };

          _nodemailer["default"].sendMail(mailOptions, function (err, success) {
            if (err) {
              console.error(err);
              return res.status(500).send({
                error: "Error Occured !",
                message: err.message
              });
            } else {
              console.log("success");
              return res.status(200).send({
                error: "Success",
                message: "OTP sent to email"
              });
            }
          });

          _context4.next = 19;
          break;

        case 16:
          _context4.prev = 16;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", res.json({
            success: false,
            message: _context4.t0.message
          }));

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.sendVerifyOtp = sendVerifyOtp;

var verifyAccount = function verifyAccount(req, res) {
  var userId, otp, user;
  return regeneratorRuntime.async(function verifyAccount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          userId = req.userId;
          otp = req.body.otp;

          if (!(!userId || !otp)) {
            _context5.next = 5;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: 'User ID and OTP are required'
          }));

        case 5:
          _context5.next = 7;
          return regeneratorRuntime.awrap(_userModel["default"].findById(userId));

        case 7:
          user = _context5.sent;

          if (user) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: 'User not found'
          }));

        case 10:
          if (!user.isVerified) {
            _context5.next = 12;
            break;
          }

          return _context5.abrupt("return", res.json({
            success: false,
            message: 'User is already verified'
          }));

        case 12:
          if (!(user.verifyOtpExpiry < Date.now())) {
            _context5.next = 14;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: 'OTP has expired'
          }));

        case 14:
          if (!(user.verifyOtp !== otp)) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid OTP'
          }));

        case 16:
          user.isVerified = true;
          user.verifyOtp = undefined;
          user.verifyOtpExpiry = undefined;
          _context5.next = 21;
          return regeneratorRuntime.awrap(user.save());

        case 21:
          return _context5.abrupt("return", res.json({
            success: true,
            message: 'Account verified successfully'
          }));

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](0);
          return _context5.abrupt("return", res.json({
            success: false,
            message: _context5.t0.message
          }));

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

exports.verifyAccount = verifyAccount;

var isAuthenticated = function isAuthenticated(req, res) {
  return regeneratorRuntime.async(function isAuthenticated$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          return _context6.abrupt("return", res.json({
            success: true,
            message: 'User is authenticated'
          }));

        case 4:
          _context6.prev = 4;
          _context6.t0 = _context6["catch"](0);
          return _context6.abrupt("return", res.json({
            success: false,
            message: _context6.t0.message
          }));

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 4]]);
};

exports.isAuthenticated = isAuthenticated;

var sendResetPasswordOtp = function sendResetPasswordOtp(req, res) {
  var email, user, otp, mailOptions;
  return regeneratorRuntime.async(function sendResetPasswordOtp$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          email = req.body.email;

          if (email) {
            _context7.next = 4;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            success: false,
            message: 'Email is required'
          }));

        case 4:
          _context7.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 6:
          user = _context7.sent;

          if (user) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            success: false,
            message: 'User not found'
          }));

        case 9:
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          user.resetOtp = otp;
          user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
          _context7.next = 14;
          return regeneratorRuntime.awrap(user.save());

        case 14:
          mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your OTP for password reset',
            html: _emailTemplates.PASSWORD_RESET_TEMPLATE.replace('{{email}}', user.email).replace('{{otp}}', otp)
          };
          _context7.next = 17;
          return regeneratorRuntime.awrap(_nodemailer["default"].sendMail(mailOptions));

        case 17:
          return _context7.abrupt("return", res.json({
            success: true,
            message: 'OTP sent to email'
          }));

        case 20:
          _context7.prev = 20;
          _context7.t0 = _context7["catch"](0);
          return _context7.abrupt("return", res.json({
            success: false,
            message: _context7.t0.message
          }));

        case 23:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.sendResetPasswordOtp = sendResetPasswordOtp;

var resetPassword = function resetPassword(req, res) {
  var _req$body3, email, otp, newPassword, user, hashedPassword;

  return regeneratorRuntime.async(function resetPassword$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body3 = req.body, email = _req$body3.email, otp = _req$body3.otp, newPassword = _req$body3.newPassword;

          if (!(!email || !otp || !newPassword)) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: 'Email, OTP and new password are required'
          }));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(_userModel["default"].findOne({
            email: email
          }));

        case 6:
          user = _context8.sent;

          if (user) {
            _context8.next = 9;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: 'User not found'
          }));

        case 9:
          if (!(user.resetOtpExpiry < Date.now())) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: 'OTP has expired'
          }));

        case 11:
          if (!(user.resetOtp !== otp)) {
            _context8.next = 13;
            break;
          }

          return _context8.abrupt("return", res.status(400).json({
            success: false,
            message: 'Invalid OTP'
          }));

        case 13:
          _context8.next = 15;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, 10));

        case 15:
          hashedPassword = _context8.sent;
          user.password = hashedPassword;
          user.resetOtp = undefined;
          user.resetOtpExpiry = undefined;
          _context8.next = 21;
          return regeneratorRuntime.awrap(user.save());

        case 21:
          return _context8.abrupt("return", res.json({
            success: true,
            message: 'Password reset successful'
          }));

        case 24:
          _context8.prev = 24;
          _context8.t0 = _context8["catch"](0);
          return _context8.abrupt("return", res.json({
            success: false,
            message: _context8.t0.message
          }));

        case 27:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

exports.resetPassword = resetPassword;