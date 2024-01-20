import { body } from "express-validator";

export default [
	body("text", "Enter the text (min chars: 1, max chars: 255)").isString().isLength({ min: 1, max:255 }),
	body("blogId", "Enter the comments blog id").isNumeric(),
	body("commentId", "Enter the comments comment id").optional({ checkFalsy: true }).isNumeric(),
];