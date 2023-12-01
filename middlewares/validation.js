import { validationResult } from "express-validator";

/* The code is exporting a default function that acts as a middleware for validating the request using
the express-validator library. */
export default (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	next();
};