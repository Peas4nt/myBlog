import { getConnection } from "../db.js";
import imageCheck from "../utils/getUserImg.js"

export default async (req, res, next) => {
	try {
		const id = req.session.user.id;

		const userData = [id];
		const userSql = `
    SELECT b.id, a.username, a.img
    FROM vt_user_profile AS a
    LEFT JOIN vt_users AS b ON a.id = b.profile_id
    WHERE b.id = ?`;

		const connection = await getConnection();
		const [user] = await connection.query(userSql, userData);
		connection.release();

		req.user = user[0];
		req.user.img = imageCheck(req.user.img);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "Server error.",
		});
	}
	next();
};