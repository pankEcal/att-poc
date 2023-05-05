const fs = require("fs");
const path = require("path");

// method to remove the uploaded files from client side
async function clearFiles() {
	const basePath = path.join(__dirname, "../../public/uploads/");
	const uploadedFiles = [];

	fs.readdirSync(basePath).map((filename) => {
		uploadedFiles.push(basePath + filename);
	});

	fs.access(basePath, (error) => {
		if (!error) {
			uploadedFiles.map((file) => {
				fs.createWriteStream(file).write("");
			});
		}
	});

	// method to remove the file
	// blocked by Error: EPERM: operation not permitted error

	// fs.access(basePath, (error) => {
	// 	if (!error) {
	// 		uploadedFiles.map((file) => {
	// 			fs.unlink(file, (error) => {
	// 				if (error) console.log(error.message);
	// 				console.log(`${file} deleted!`);
	// 			});
	// 		});
	// 	}
	// });
}

module.exports = { clearFiles };
