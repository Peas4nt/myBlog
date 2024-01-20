// routes/pagesRoutes.js
import express from "express";
import multer from "multer";

import {
	blogController,
	commentController,
	userController,
} from "../controllers/pages/index.js";

import {
	blogValidation,
	commentValidation,
	signinValidation,
	singupValidation,
	profileValidation,
	privateValidation,
	followValidation,
	likeValidation,
} from "../validations/index.js";

import {
	validationCheck,
	userInf,
	sessionCheck,
	logout,
} from "../middlewares/index.js";

import { blogStorage, profileStorage } from "../multerConfig.js";

const router = express.Router();

// Multer configuration
const blogUpload = multer({ storage: blogStorage });
const profilesUpload = multer({ storage: profileStorage });

// user singin and singup
router.get("/signin", userController.getSignin);
router.post(
	"/signin",
	blogUpload.none(),
	signinValidation,
	validationCheck,
	userController.postSignin,
);
router.post(
	"/signup",
	blogUpload.none(),
	singupValidation,
	validationCheck,
	userController.postSignup,
);
router.get("/logout", logout);

router.use(sessionCheck);
router.use(userInf);

// Main page with all blogs
router.get("/", blogController.getAll);

// Blog creation
router.get("/blog/create", blogController.getCreate);
router.post(
	"/blog",
	blogUpload.array("images", 6),
	blogValidation,
	validationCheck,
	blogController.postCreate,
);
router.delete("/blog", blogUpload.none(), blogController.remove);
router.get("/blog/:id", blogController.getOne);

// Comment creation
router.post(
	"/comment",
	blogUpload.none(),
	commentValidation,
	validationCheck,
	commentController.postCreate,
);
router.delete("/comment", blogUpload.none(), commentController.remove);
router.get("/comment/:id", commentController.getOne);

// blog like
router.post(
	"/blog/like",
	blogUpload.none(),
	likeValidation,
	validationCheck,
	blogController.postLike,
);

// Profiles
router.get("/settings", userController.getSettings);
router.put(
	"/settings/img",
	profilesUpload.single("image"),
	userController.putImage,
);
router.put(
	"/settings/profile",
	profilesUpload.none(),
	profileValidation,
	validationCheck,
	userController.putProfile,
);
router.put(
	"/settings/private",
	profilesUpload.none(),
	privateValidation,
	validationCheck,
	userController.putPrivate,
);

router.post(
	"/profile/subsribe",
	followValidation,
	validationCheck,
	profilesUpload.none(),
	userController.postSubcribe,
);
router.get("/profile/:id?", userController.getProfile);

export default router;
