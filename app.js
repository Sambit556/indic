const express = require("express");
require("dotenv").config();

const app = express();
require("./middleware/middleware")(app);
require("./Routes/index.route")(app);

module.exports = app;
