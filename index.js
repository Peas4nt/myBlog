import express from "express";
import multer from "multer";
import path from "path";

import { testConnection } from "./db.js";
import * as blogController from "./controllers/blogController.js";
import * as commentController from "./controllers/commentController.js";
import * as userController from "./controllers/userController.js";


// middleware
import validationCheck from "./middlewares/validation.js";
import userInf from "./middlewares/userInf.js";

// validation
import blogCreateValidation from "./validations/blogValidation.js";

// env
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


// multer storage configuration
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

app.use(userInf)
// Main page with all blogs
app.get("/", blogController.getAll);

// Blog creation
app.get("/blog/create", blogController.getCreate);
app.post("/blog", upload.array("images", 6), blogCreateValidation, validationCheck, blogController.postCreate);
// Page with one blog and comments
app.get("/blog/:id", blogController.getOne);


// Comment creation
app.post("/comment", upload.none(), commentController.postCreate)
// Page with one comment and his child comments
app.get("/comment/:id", commentController.getOne);

// blog like
app.post("/blog/like", upload.none(), blogController.postLike)

// Profiles
app.get("/profile/:id?", userController.getProfile);



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
