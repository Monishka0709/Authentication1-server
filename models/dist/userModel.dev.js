"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verifyOtp: {
    type: String,
    "default": ''
  },
  verifyOtpExpiry: {
    type: Number,
    "default": 0
  },
  isVerified: {
    type: Boolean,
    "default": false
  },
  resetOtp: {
    type: String,
    "default": ''
  },
  resetOtpExpiry: {
    type: Number,
    "default": 0
  }
});

var userModel = _mongoose["default"].models.user || _mongoose["default"].model('user', userSchema);

var _default = userModel;
exports["default"] = _default;