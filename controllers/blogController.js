import { getConnection } from "../db.js";
import timeDiff from "../utils/timeDiff.js";

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

		const [blogs] = await connection.query(blogsSql);

		blogs.map(blog => {
			blog.createdAt = timeDiff(blog.createdAt)
			return blog
		})

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

export const getOne = (req, res) => {};

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

export const update = (req, res) => {};

export const remove = (req, res) => {};
