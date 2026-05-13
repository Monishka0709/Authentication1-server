"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userAuth = function userAuth(req, res, next) {
  var token, decoded;
  return regeneratorRuntime.async(function userAuth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.cookies.token;

          if (token) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: 'Token not found'
          }));

        case 3:
          _context.prev = 3;
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);

          if (decoded) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: 'Invalid token'
          }));

        case 7:
          req.userId = decoded.id;
          next();
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          return _context.abrupt("return", res.status(401).json({
            success: false,
            message: 'Unauthorized'
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 11]]);
};

var _default = userAuth;
exports["default"] = _default;