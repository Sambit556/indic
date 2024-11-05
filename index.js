const http = require("http");
const app = require("./app.js");
const connectDB = require("./config/database.js");

const port = process.env.PORT || 4000;

connectDB();
const server = http.createServer(app);
server.listen(port, () => {
     console.log(`Server is listening on port ${port} 💥💨`);
});