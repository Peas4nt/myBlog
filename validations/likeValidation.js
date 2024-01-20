import { body } from "express-validator";

export default [
  body("blogId", "Enter the blog id").custom(value => {
    const numericValue = parseInt(value, 10);
    if (typeof numericValue !== "number") {
      throw new Error("blog id is must be a number");
    }
    return true;
  }),
  body("status", "Enter the like status (true for like, false for unlike)").custom(value => {
    const booleanValue = Boolean(value);
    if (typeof booleanValue !== "boolean") {
      throw new Error("Like status must be a boolean");
    }
    return true;
  }),
	body("commentId", "Enter the comment id").optional({checkFalsy: true}).isNumeric(),

];