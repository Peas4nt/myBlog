import { body } from "express-validator";

export default [
	body("status", "Enter blog status public: 1 or private: 2").isNumeric(),
	body("text", "Enter the text (min chars: 1, max chars: 255)").isString().isLength({ min: 1, max:255 }),
	body("images", "To many images, max: 6").optional().isArray({ max: 6}),
];