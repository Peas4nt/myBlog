import { body } from "express-validator";

export default [
	body("text", "Enter the text (min chars: 1, max chars: 255)").isString().isLength({ min: 1, max:255 }),
];