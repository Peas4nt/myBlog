export default (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return next(err);
    }
    res.redirect("/signin");
  });
};