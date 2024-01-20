import { body } from "express-validator";

export default [
	body("userId", "Enter the user id").custom((value) => {
		const numericValue = parseInt(value, 10);
		if (typeof numericValue !== "number") {
			throw new Error("Profile is must be a number");
		}
		return true;
	}),
	body("username", "Enter the username")
		.isString()
		.isLength({ min: 3, max: 40 }),
	body("description", "Enter the profile description(min: 0, max: 255)")
		.optional({ checkFalsy: true })
		.isString()
		.isLength({ min: 0, max: 255 }),
];
