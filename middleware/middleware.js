const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const { rateLimit } = require("express-rate-limit");

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests 
    standardHeaders: true,
    legacyHeaders: false,
});

const corsOptions = {
    origin: "*", 
    optionsSuccessStatus: 200,
};

logger.token("body", (req) => JSON.stringify(req.body));
const logMiddleware = logger("tiny");

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(cors(corsOptions));
    app.use(logMiddleware);
    app.use(limiter);
};
