const http = require("http");

const app = require("./app");

const server = http.createServer(app); // create a HTTP server and host it with express app
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
	console.log(`app is running on PORT ${PORT}`);
});
