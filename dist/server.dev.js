"use strict";

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

require("dotenv/config");

var _mongodb = _interopRequireDefault(require("./config/mongodb.js"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _authRoutes = _interopRequireDefault(require("./views/authRoutes.js"));

var _userRoutes = _interopRequireDefault(require("./views/userRoutes.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = process.env.PORT || 4000;
(0, _mongodb["default"])();
var allowedOrigins = [process.env.FRONTEND_URL];
app.use(_express["default"].json());
app.use((0, _cookieParser["default"])());
app.use((0, _cors["default"])({
  origin: 'https://authentication1-mern.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // API endpoints

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/api/auth', _authRoutes["default"]);
app.use('/api/user', _userRoutes["default"]);
app.listen(port, function () {
  console.log("Server is running on port ".concat(port));
});