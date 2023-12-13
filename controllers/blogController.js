import { getConnection } from "../db.js";
import timeDiff from "../utils/timeDiff.js";
import imageCheck from "../utils/getUserImg.js";
import { response } from "express";

// main page with all blogs
export const getAll = async (req, res) => {
	try {
		const blogsSql = `
		SELECT a.id, c.id AS userId, c.username, c.img AS userImage ,a.text, a.img, a.views, a.created_at as createdAt, 
		(SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = 1 AND blog_id = a.id AND comment_id is NULL)) AS likestatus,
		(SELECT COUNT(*) FROM vt_likes WHERE blog_id = a.id AND comment_id IS NULL) AS likes,
		(SELECT COUNT(*) FROM vt_comments WHERE blog_id = a.id) AS comments
		
		FROM vt_blogs AS a
		LEFT JOIN vt_users AS b 
		ON b.id = a.user_id
		LEFT JOIN vt_user_profile AS c
		ON c.id = b.inf_id
		WHERE a.${`status`} = 1 OR c.id = 1
		ORDER BY a.created_at DESC`;

		const connection = await getConnection();
		const [blogs] = await connection.query(blogsSql, req.user.id, req.user.id);
		connection.release();

		blogs.map((blog) => {
			blog.createdAt = timeDiff(blog.createdAt);
			blog.userImage = imageCheck(blog.userImage);
			return blog;
		});

		res.render("index", {
			page: "Home",
			user: req.user,
			blogs,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant render blog creating",
		});
	}
};

// page with one blog and comments
export const getOne = async (req, res) => {
	try {
		const userId = req.user.id;
		const blogId = req.params.id;
		const blogData = [userId, blogId, userId];
		const blogsSql = `
		SELECT a.id, c.id AS userId, c.username, c.img AS userImage ,a.text, a.img, a.views, a.created_at as createdAt, 
		(SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = ? AND blog_id = a.id AND comment_id is NULL)) AS likestatus,
		(SELECT COUNT(*) FROM vt_likes WHERE blog_id = a.id AND comment_id IS NULL) AS likes,
		(SELECT COUNT(*) FROM vt_comments WHERE blog_id = a.id) AS comments
		FROM vt_blogs AS a
		LEFT JOIN vt_users AS b 
		ON b.id = a.user_id
		LEFT JOIN vt_user_profile AS c
		ON c.id = b.inf_id
		WHERE a.id = ? AND (a.${`status`} = 1 OR c.id = ?)`;

		const blogViewData = [blogId];
		const blogViewSql = `
		UPDATE vt_blogs 
		SET views = views + 1
		WHERE id = ?
		`;

		const commentsData = [userId, userId, blogId];
		const commentsSql = `
		SELECT 
		u1.id AS userId,
			u_inf1.username,
			u_inf1.img AS userImage,
			c1.id, 
			c1.text,
			c1.views,
			c1.blog_id,
			c1.created_at,
			(SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = ? AND blog_id = c1.blog_id AND c1.id = comment_id)) AS likestatus,
				(SELECT COUNT(*) FROM vt_likes WHERE blog_id = c1.blog_id AND comment_id = c1.id) AS likes,
				(SELECT COUNT(*) FROM vt_comments WHERE blog_id = c1.blog_id AND comment_id = c1.id) AS comments,
			CONCAT(
				'[',
				GROUP_CONCAT(
					JSON_OBJECT(
						'userId', u2.id,
						'username', u_inf2.username,
						'userImage', u_inf2.img,
						'id', c2.id,
						'text', c2.text,
						'views', c2.views,
						'blog_id', c2.blog_id,
						'created_at', c2.created_at,
						'likestatus', (SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = ? AND blog_id = c2.blog_id AND c2.id = comment_id)),
						'likes', (SELECT COUNT(*) FROM vt_likes WHERE blog_id = c2.blog_id AND comment_id = c2.id),
						'comments',(SELECT COUNT(*) FROM vt_comments WHERE blog_id = c2.id AND comment_id = c2.id)
					)
				),
				']'
			) AS responses
		
		FROM vt_comments AS c1
		LEFT JOIN vt_users AS u1 ON  c1.user_id = u1.id
		LEFT JOIN vt_user_profile AS u_inf1 ON u1.id = u_inf1.id
		LEFT JOIN vt_comments AS c2 ON c2.comment_id = c1.id
		LEFT JOIN vt_users AS u2 ON  c2.user_id = u2.id
		LEFT JOIN vt_user_profile AS u_inf2 ON u2.id = u_inf2.id
		WHERE c1.blog_id = ? AND c1.comment_id IS NULL
		GROUP BY c1.id
		ORDER BY likes DESC;
		`;

		const connection = await getConnection();
		// view++
		await connection.query(blogViewSql, blogViewData);
		// get blog data
		const [blogs] = await connection.query(blogsSql, blogData);
		// get blog comments
		const [comments] = await connection.query(commentsSql, commentsData);

		connection.release();

		if (blogs.length > 0) {
			const blog = blogs[0];
			blog.createdAt = timeDiff(blog.createdAt);
			blog.userImage = imageCheck(blog.userImage);

			if (comments.length > 0) {
				comments.map((comm) => {
					comm.created_at = timeDiff(comm.created_at);
					comm.userImage = imageCheck(comm.userImage);
					comm.responses = JSON.parse(comm.responses);
					if (comm.responses[0].userId != null) {
						comm.responses.map((childComm) => {
							childComm.created_at = timeDiff(
								childComm.created_at,
							);
							childComm.userImage = imageCheck(
								childComm.userImage,
							);

							return childComm;
						});
						return comm;
					} else comm.responses = [];
				});
			}
			res.render("oneBlog", {
				page: `blog ${blogId}`,
				user: req.user,
				blog,
				comments,
			});
		} else {
			res.status(404).json({ msg: "Blog not found" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant render blog creating",
		});
	}
};

// create blog page
export const getCreate = async (req, res) => {
	res.render("blogCreating", {
		page: "Blog Create",
		user: req.user,
	});
};

// post method for creating blog in db
export const postCreate = async (req, res) => {
	try {
		// blog variables
		const id = req.user.id;
		const images = req.files;
		const text = req.body.text;
		const status = req.body.status;
		const imagePaths = images.map((file) => {
			return "/uploads/blogs/" + file.filename;
		});
		const createAt = new Date();

		// db variables
		const data = [id, text, JSON.stringify(imagePaths), status, createAt];
		const sql = `INSERT INTO vt_blogs (user_id, text, img, status, created_at)
		VALUES (?, ?, ?, ?, ?);`;

		const connection = await getConnection();
		const [result] = await connection.query(sql, data);
		connection.release();

		res.json({
			msg: "Blog created successufully.",
			blogId: result.insertId,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant create blog.",
		});
	}
};

// like save in db
export const postLike = async (req, res) => {
	try {
		// db variables
		const id = req.user.id;
		const blogId = parseInt(req.body.blogId);
		const commentId = req.body.commentId ? req.body.commentId : null;
		const status = req.body.status;

		const data = [id, blogId, commentId];
		const sqlLike = `INSERT INTO vt_likes (user_id, blog_id, comment_id) VALUES (?, ?, ?)`;
		const sqlUnlike = `DELETE FROM vt_likes WHERE user_id = ? AND blog_id = ? AND comment_id ${
			commentId == null ? "is" : "="
		} ?`;

		const connection = await getConnection();
		if (status == "true") {
			await connection.query(sqlLike, data);
			res.status(200).json({ msg: "Post liked" });
		} else {
			await connection.query(sqlUnlike, data);
			res.status(200).json({ msg: "Post unliked" });
		}
		connection.release();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, like error",
		});
	}
};

export const update = (req, res) => {};

export const remove = (req, res) => {};
