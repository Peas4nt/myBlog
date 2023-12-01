import { getConnection } from "../db.js";

export const getAll = (req, res) => {};

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
	} catch (error) {}
};

export const postCreate = async (req, res) => {
	const images = req.files;
	const text = req.body.text;
	const status = req.body.status;
	const imagePaths = images.map((file) => {
		return "/uploads/blogs/" + file.filename; // Путь для доступа через веб
	});

	// db variables
	const id = 1;
	const data = [id, text, JSON.stringify(imagePaths), status];
	const sql = `INSERT INTO vt_blogs (user_id, text, img, status)
	VALUES (?, ?, ?, ?);`;
	try {
		// Вывод путей к изображениям в консоль
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
