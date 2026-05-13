"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserData = void 0;

var _userModel = _interopRequireDefault(require("../models/userModel.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getUserData = function getUserData(req, res) {
  var userId, user;
  return regeneratorRuntime.async(function getUserData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.userId;
          _context.next = 4;
          return regeneratorRuntime.awrap(_userModel["default"].findById(userId));

        case 4:
          user = _context.sent;

          if (user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'User not found'
          }));

        case 7:
          res.status(200).json({
            success: true,
            userData: {
              name: user.name,
              email: user.email,
              isAccountVerified: user.isVerified
            }
          });
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: 'Server error'
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getUserData = getUserData;