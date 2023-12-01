import express from "express";
import multer from "multer";
import path from "path";

import { testConnection } from "./db.js";
import * as blogController from "./controllers/blogController.js";

import dotenv from "dotenv";
dotenv.config();

// servera ports
const PORT = process.env.PORT ?? 3000;
// create express aplication
const app = express();

// website render tool
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
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
const upload = multer({ storage: storage });

// routes
// Blog creating
app.get("/", blogController.getCreate);
app.post("/", upload.array("images"), blogController.postCreate);

// start server function
const start = async () => {
	// check db connection
	const dbErr = await testConnection();
	if (dbErr) return console.error("DB error: ", dbErr);

	app.listen(PORT, (err) => {
		// check server errors
		if (err) return console.error("Server errror: ", err);
		console.log(`Server OK\nhttp://localhost:${PORT}/`);
	});
};

start();
