import express from "express";
import session from "express-session";
import multer from "multer";

import { testConnection } from "./db.js";
import * as blogController from "./controllers/blogController.js";
import * as commentController from "./controllers/commentController.js";
import * as userController from "./controllers/userController.js";

// middleware
import validationCheck from "./middlewares/validation.js";
import userInf from "./middlewares/userInf.js";
import sessionCheck from "./middlewares/sessionCheck.js";
import logout from "./middlewares/logout.js";

// validation
import blogCreateValidation from "./validations/blogValidation.js";

// multer configuration
import { blogStorage, profileStorage } from "./multerConfig.js";

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

// sessija
app.use(
	session({
		secret: "qwerty",
		resave: false,
		saveUninitialized: false,
	}),
);

// multer blog storage
const blogUpload = multer({ storage: blogStorage });
const profilesUpload = multer({ storage: profileStorage });

// user singin and singup
app.get("/signin", userController.getSignin);
app.post("/signin", blogUpload.none(), userController.postSignin);
app.post("/signup", blogUpload.none(), userController.postSignup);
app.get("/logout", logout);


app.use(sessionCheck);
app.use(userInf);

// Main page with all blogs
app.get("/", blogController.getAll);

// Blog creation
app.get("/blog/create", blogController.getCreate);
app.post(
	"/blog",
	blogUpload.array("images", 6),
	blogCreateValidation,
	validationCheck,
	blogController.postCreate,
);
app.delete("/blog", blogUpload.none(), blogController.remove);
app.get("/blog/:id", blogController.getOne);

// Comment creation
app.post("/comment", blogUpload.none(), commentController.postCreate);
app.delete("/comment", blogUpload.none(), commentController.remove);
app.get("/comment/:id", commentController.getOne);

// blog like
app.post("/blog/like", blogUpload.none(), blogController.postLike);

// Profiles
app.get("/settings", userController.getSettings);
app.put(
	"/settings/img",
	profilesUpload.single("image"),
	userController.putImage,
);
app.put("/settings/profile", profilesUpload.none(), userController.putProfile);
app.put("/settings/private", profilesUpload.none(), userController.putPrivate);

app.post(
	"/profile/subsribe",
	profilesUpload.none(),
	userController.postSubcribe,
);
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
