"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var connectDB = function connectDB() {
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _mongoose["default"].connection.on('connected', function () {
            console.log('MongoDB connected');
          });

          _context.next = 3;
          return regeneratorRuntime.awrap(_mongoose["default"].connect("".concat(process.env.MONGODB_URI, "/authentication")));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = connectDB;
exports["default"] = _default;