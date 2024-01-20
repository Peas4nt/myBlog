import { body } from "express-validator";

export default [
	body("username", "Enter the username").isString().isLength({min: 3, max: 40}),
	body("email", "Enter the email").isEmail().isLength({min: 3, max: 40}),
	body("password", "Enter the password(min: 3, max: 40)").isString().isLength({min: 3, max: 40}),
	body("password2", "Repeat the password ").isString().isLength({min: 3, max: 40}),
];