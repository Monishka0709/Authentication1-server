"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userController = require("../controllers/userController.js");

var _userAuth = _interopRequireDefault(require("../middleware/userAuth.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userRouter = _express["default"].Router();

userRouter.get('/getUserData', _userAuth["default"], _userController.getUserData);
var _default = userRouter;
exports["default"] = _default;