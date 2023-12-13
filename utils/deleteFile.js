import fs from "fs";
import path from "path";

const __dirname = path.resolve();
export default function deleteFile(filePath) {
	if (filePath) {
		const dirFilePath = path.join(__dirname, filePath);
		fs.unlink(dirFilePath, (err) => {
			if (err) {
				console.error("File deleting error: ", err);
			}
		});
	}
}
