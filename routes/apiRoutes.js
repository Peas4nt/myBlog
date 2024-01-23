// routes/pagesRoutes.js
import express from "express";
import multer from "multer";

import { blogController, commentController, userController } from "../controllers/api/index.js";

import { validationCheck } from "../middlewares/index.js";

import {
	userValidation,
	blogDeleteValidation,
	blogUpdateValidation,
} from "../validations/index.js";

import { blogStorage } from "../multerConfig.js";
const blogUpload = multer({ storage: blogStorage });

const router = express.Router();

// Blog api
router.get("/blogs", blogController.getAll);
router.put(
	"/blogs",
	blogUpload.none(),
	blogUpdateValidation,
	validationCheck,
	blogController.update,
);
router.delete(
	"/blogs",
	blogUpload.none(),
	blogDeleteValidation,
	validationCheck,
	blogController.remove,
);

// Comment api
router.get("/comments", commentController.getAll);
router.put(
	"/comments",
	blogUpload.none(),
	blogUpdateValidation,
	validationCheck,
	commentController.update,
);
router.delete(
	"/comments",
	blogUpload.none(),
	blogDeleteValidation,
	validationCheck,
	commentController.remove,
);

// User api
router.get("/users", userController.getAll);
router.put(
	"/users",
	blogUpload.none(),
	userValidation,
	validationCheck,
	userController.update,
);
router.delete(
	"/users",
	blogUpload.none(),
	blogDeleteValidation,
	validationCheck,
	userController.remove,
);

export default router;
