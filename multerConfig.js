import multer from "multer";
import path from "path";

// multer storage configuration
export const blogStorage = multer.diskStorage({
	// file destination save
	destination: function (req, file, cb) {
		cb(null, "uploads/blogs");
	},
	// file name
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname),
		);
	},
});

// multer storage configuration
export const profileStorage = multer.diskStorage({
	// file destination save
	destination: function (req, file, cb) {
		cb(null, "uploads/profiles");
	},
	// file name
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname),
		);
	},
});