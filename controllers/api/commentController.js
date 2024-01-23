import { getConnection } from "../../db.js";

export const getAll = async (req, res) => {
	try {
		const commentsSql = `
    SELECT 
    c1.id, 
    c1.blog_id,
    c1.comment_id,
    u1.id AS userId,
    u_inf1.username,
    c1.text,
    c1.created_at,
    c1.views,
            (
    SELECT COUNT(*)
    FROM vt_likes
    WHERE blog_id = c1.blog_id AND comment_id = c1.id) AS likes,
            (
    SELECT COUNT(*)
    FROM vt_comments
    WHERE blog_id = c1.blog_id AND comment_id = c1.id) AS comments
    FROM vt_comments AS c1
    LEFT JOIN vt_users AS u1 ON c1.user_id = u1.id
    LEFT JOIN vt_user_profile AS u_inf1 ON u1.id = u_inf1.id
    ORDER BY c1.created_at DESC;`;
  
		const connection = await getConnection();
		const [comments] = await connection.query(commentsSql);
		connection.release();
  
		res.json(comments);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant send comments",
		});
	}
};

export const update = async (req, res) => {
	try {
		const commentsId = req.body.blogId;
		const text = req.body.text;

		const commentsPutData = [text, commentsId];
		const commentsPutSql = `
		UPDATE vt_comments
		SET TEXT = ?
		WHERE id = ?`;

		const connection = await getConnection();
		await connection.query(commentsPutSql, commentsPutData);
		connection.release();

		res.json({
			msg: "Comments edit successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, cant edit comments",
		});
	}
};

export const remove = async (req, res) => {
	try {
		const commentsId = req.body.blogId;

		const commentsDeleteData = [commentsId];
		const commentsDeletSql = `
		DELETE FROM vt_comments WHERE id = ?`;

		const connection = await getConnection();
		await connection.query(commentsDeletSql, commentsDeleteData);
		connection.release();

		res.json({
			msg: "Comments deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, cant remove comments",
		});
	}
};
