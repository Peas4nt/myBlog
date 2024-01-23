import { body } from "express-validator";

export default [body("blogId", "Enter the id").isNumeric()];
