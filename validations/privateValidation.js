import { body } from "express-validator";

export default [
	body("firstName", "Enter the firstName").optional({ checkFalsy: true }).isString().isLength({min: 0, max: 40}),
	body("lastName", "Enter the lastName").optional({ checkFalsy: true }).isString().isLength({min: 0, max: 40}),
	body("email", "Enter the email").isEmail().isLength({min: 3, max: 40}),
	body("currentPassword", "Enter the old password(min: 3, max: 40)").isString().isLength({min: 3, max: 40}),
	body("newPassword", "Enter the new password(min: 3, max: 40)").optional({ checkFalsy: true }).isString().isLength({min: 3, max: 40}),
	body("confirmPassword", "Repeat the new password(min: 3, max: 40)").optional({ checkFalsy: true }).isString().isLength({min: 3, max: 40}),
];