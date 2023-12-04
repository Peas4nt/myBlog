import { getConnection } from "../db.js";
import timeDiff from "../utils/timeDiff.js";

// main page with all blogs
export const getAll = async (req, res) => {
	const id = 1;
	const userData = [id];
	const userSql = `
  SELECT a.username, a.img
  FROM vt_user_profile AS a
  LEFT JOIN  vt_users AS b ON a.id = b.profile_id
  WHERE b.id = ?`;

	const blogsSql = `
	SELECT a.id, c.username, c.img AS userImage ,a.text, a.img, a.views, a.created_at as createdAt, 
	(SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = 1 AND blog_id = a.id)) AS likestatus,
	(SELECT COUNT(*) FROM vt_likes AS d WHERE d.blog_id = a.id AND d.comment_id IS NULL) AS likes,
	(SELECT COUNT(*) FROM vt_comments AS e WHERE e.blog_id = a.id) AS comments
	
	FROM vt_blogs AS a
	LEFT JOIN vt_users AS b 
	ON b.id = a.user_id
	LEFT JOIN vt_user_profile AS c
	ON c.id = b.inf_id
	ORDER BY created_at DESC`;

	try {
		const connection = await getConnection();
		const [user] = await connection.query(userSql, userData);

		const [blogs] = await connection.query(blogsSql, userData);

		blogs.map((blog) => {
			blog.createdAt = timeDiff(blog.createdAt);
			return blog;
		});

		res.render("index", {
			user: user[0],
			blogs,
		});
		connection.release();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Server error, server cant render blog creating",
		});
	}
};

// page with one blog and comments
export const getOne = (req, res) => {};

// create blog page
export const getCreate = async (req, res) => {
	const id = 1;
	const data = [id];
	const sql = `
  SELECT a.username, a.img
  FROM vt_user_profile AS a
  LEFT JOIN  vt_users AS b ON a.id = b.profile_id
  WHERE b.id = ?`;

	try {
		const connection = await getConnection();
		const [user] = await connection.query(sql, data);

		res.render("blogCreating", {
			user: user[0],
		});
		connection.release();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Server error, server cant render blog creating",
		});
	}
};

// post method for creating blog in db
export const postCreate = async (req, res) => {
	// blog variables
	const images = req.files;
	const text = req.body.text;
	const status = req.body.status;
	const imagePaths = images.map((file) => {
		return "/uploads/blogs/" + file.filename;
	});
	const createAt = new Date();

	// db variables
	const id = 1;
	const data = [id, text, JSON.stringify(imagePaths), status, createAt];
	const sql = `INSERT INTO vt_blogs (user_id, text, img, status, created_at)
	VALUES (?, ?, ?, ?, ?);`;

	try {
		const connection = await getConnection();
		await connection.query(sql, data);
		connection.release();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Server error, server cant render blog creating",
		});
	}
};

// like save in db
export const postLike = async (req, res) => {
	// db variables
	const id = 1;
	const blogId = req.body.blogId;
	const commentId = req.body.commentId ?? null;
	const status = req.body.status;

	const data = [id, blogId, commentId];
	const sqlLike = `INSERT INTO vt_likes (user_id, blog_id, comment_id) VALUES (?, ?, ?)`;
	const sqlUnlike = `DELETE FROM vt_likes WHERE user_id = ? AND blog_id = ? AND comment_id ${(req.body.commentId == null) ? "is" : "="} ?`;
	
	if (status == "true") {
		try {
			const connection = await getConnection();
			await connection.query(sqlLike, data);
			connection.release();
			res.status(200).json({message: "Post liked"})
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server error, server cant like it",
			});
		}
	} else {
		try {
			const connection = await getConnection();
			await connection.query(sqlUnlike, data);
			connection.release();
			res.status(200).json({message: "Post unliked", status})
		} catch (error) {
			console.log(error);
			res.status(500).json({
				message: "Server error, server cant unlike it",
			});
		}
	}
};

export const update = (req, res) => {};

export const remove = (req, res) => {};
