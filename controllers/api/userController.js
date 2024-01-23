import { getConnection } from "../../db.js";
import deleteFile from "../../utils/deleteFile.js";

export const getAll = async (req, res) => {
	try {
		const usersSql = `
    SELECT * FROM vt_users AS u
    LEFT JOIN vt_user_profile AS up ON up.id = u.profile_id
    LEFT JOIN vt_user_inf AS ui ON ui.id = u.inf_id`;

		const connection = await getConnection();
		const [users] = await connection.query(usersSql);
		connection.release();

		res.json(users);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant send users",
		});
	}
};

export const update = async (req, res) => {
	try {
		const {
			userId,
			username,
			description,
			firstName,
			lastName,
			email,
			password,
		} = req.body;

		const profileData = [username, description, userId];
		const profilesSql = `
		UPDATE vt_user_profile
		SET 
		username = ?,
		DESCRIPTION = ? 
		WHERE id = ?`;

		const privateData = [firstName, lastName, email, password, userId ];
		const privateSql = `
		UPDATE vt_user_inf 
		SET 
		NAME = ?,
		surname = ?,
		email = ?,
		password = ?
		WHERE id = ?`;

    const checkData = [email, userId];
		const checkSql = `
		SELECT EXISTS(SELECT * FROM vt_user_inf WHERE email = ? AND id != ?) AS check_data`;

		const connection = await getConnection();
		const [check] = await connection.query(checkSql, checkData);
    if (check[0].check_data == 1) {
			return res.status(400).json({
				msg: "That email address is already in use.",
			});
		}
	
		await connection.query(profilesSql, profileData);
		await connection.query(privateSql, privateData);
		connection.release();

		res.json({
			msg: "User edit successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, cant edit user",
		});
	}
};
export const remove = async (req, res) => {
	try {
		const userId = req.body.blogId;

		const userDeleteData = [userId];
		const userDeletSql = `
		DELETE FROM vt_users WHERE id = ?`;

		const userImgData = [userId];
		const userImgSql = `
		SELECT img FROM vt_user_profile WHERE id = ?`;

		const connection = await getConnection();
		const [blog] = await connection.query(userImgSql, userImgData);
		await connection.query(userDeletSql, userDeleteData);
		connection.release();
		
		deleteFile(blog[0].img);

		res.json({
			msg: "User deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, cant remove user",
		});
	}
};
