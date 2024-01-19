// pārbauda vai lietotājs ir "ielogojies"
export default (req, res, next) => {
	if (req.session && req.session.user) {
		return next();
	}
	// ja lietotājs nav "ielogots", novirza uz login lapu
	res.redirect("/signin");
};
