const http = require("http");

const app = require("./app");

const appServer = http.createServer(app);
const PORT = 8000;

appServer.listen(PORT, () => {
	console.log(`app is running on PORT ${PORT}`);
});
