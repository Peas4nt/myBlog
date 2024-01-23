import { getConnection } from "../../db.js";
import deleteFile from "../../utils/deleteFile.js";

export const getAll = async (req, res) => {
	try {
		const blogsSql = `
		SELECT a.id, c.id AS userId, c.username, a.text, a.img, a.views, a.created_at as createdAt, 
		(SELECT COUNT(*) FROM vt_likes WHERE blog_id = a.id AND comment_id IS NULL) AS likes,
		(SELECT COUNT(*) FROM vt_comments WHERE blog_id = a.id) AS comments
		
		FROM vt_blogs AS a
		LEFT JOIN vt_users AS b 
		ON b.id = a.user_id
		LEFT JOIN vt_user_profile AS c
		ON c.id = b.inf_id
		ORDER BY a.created_at DESC`;

		const connection = await getConnection();
		const [blogs] = await connection.query(blogsSql);
		connection.release();

		res.json(blogs);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant send blogs",
		});
	}
};

export const update = async (req, res) => {
	try {
		const blogId = req.body.blogId;
		const text = req.body.text;

		const blogPutData = [text, blogId];
		const blogPutSql = `
		UPDATE vt_blogs
		SET TEXT = ?
		WHERE id = ?`;

		const connection = await getConnection();
		await connection.query(blogPutSql, blogPutData);
		connection.release();

		res.json({
			msg: "Blog edit successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, cant edit blog",
		});
	}
};
export const remove = async (req, res) => {
	try {
		const blogId = req.body.blogId;

		const blogDeleteData = [blogId];
		const blogDeletSql = `
		DELETE FROM vt_blogs WHERE id = ?`;

		const blogImgData = [blogId];
		const blogImgSql = `
		SELECT img FROM vt_blogs WHERE id = ?`;

		const connection = await getConnection();

		const [blog] = await connection.query(blogImgSql, blogImgData);
		await connection.query(blogDeletSql, blogDeleteData);
		connection.release();

		const imgs = JSON.parse(blog[0].img);
		imgs.forEach((path) => {
			deleteFile(path);
		});

		res.json({
			msg: "Blog deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, cant remove blog",
		});
	}
};
