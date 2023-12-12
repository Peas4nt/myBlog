import { getConnection } from "../db.js";

export const getProfile = async (req, res) => {
	try {
		const profileId = req.params.id ?? req.user.id;

		const profileData = [profileId];
		const profilesSql = `
    SELECT inf.username, inf.img, inf.description 
    FROM vt_user_profile AS inf
    LEFT JOIN vt_users AS user ON inf.id = user.profile_id
    WHERE user.id = ?`;

		const profileBlogsData = [profileId];
		const profileBlogsSql = `
    SELECT a.id, c.id AS userId, c.username, c.img AS userImage ,a.text, a.img, a.views, a.created_at as createdAt, 
		(SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = 1 AND blog_id = a.id AND comment_id is NULL)) AS likestatus,
		(SELECT COUNT(*) FROM vt_likes WHERE blog_id = a.id AND comment_id IS NULL) AS likes,
		(SELECT COUNT(*) FROM vt_comments WHERE blog_id = a.id) AS comments
		
		FROM vt_blogs AS a
		LEFT JOIN vt_users AS b 
		ON b.id = a.user_id
		LEFT JOIN vt_user_profile AS c
		ON c.id = b.inf_id
		WHERE b.id = ?
		ORDER BY created_at DESC`;

		// const connection = await getConnection()
		// connection.release();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant render profile",
		});
	}
};
