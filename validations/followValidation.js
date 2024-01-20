import { body } from "express-validator";

export default [
  body("profileId", "Enter the profile id").custom(value => {
    const numericValue = parseInt(value, 10);
    if (typeof numericValue !== "number") {
      throw new Error("Profile is must be a number");
    }
    return true;
  }),
  body("status", "Enter the follow status (true for follow, false for unfollow)").custom(value => {
    const booleanValue = Boolean(value);
    if (typeof booleanValue !== "boolean") {
      throw new Error("Follow status must be a boolean");
    }
    return true;
  }),
];