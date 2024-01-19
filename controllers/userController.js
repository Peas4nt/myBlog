import { getConnection } from "../db.js";
import timeDiff from "../utils/timeDiff.js";
import imageCheck from "../utils/getUserImg.js";
import deleteFile from "../utils/deleteFile.js";

export const getProfile = async (req, res) => {
	try {
		const profileId = req.params.id ?? req.user.id;

		const profileData = [
			profileId,
			req.user.id,
			profileId,
			profileId,
			profileId,
		];
		const profilesSql = `
		SELECT user.id, inf.username, inf.img, inf.description, inf.created_at as createdAt,
		(SELECT EXISTS(SELECT * FROM vt_subcribers WHERE user_id = ? AND subscriber_id = ?)) AS followStatus,
		(SELECT COUNT(*) FROM vt_subcribers WHERE user_id = ? ) AS followers,
		(SELECT COUNT(*) FROM vt_subcribers WHERE subscriber_id = ? ) AS follow
		FROM vt_user_profile AS inf
		LEFT JOIN vt_users AS user ON inf.id = user.profile_id
		WHERE user.id = ?`;

		const profileBlogsData = [req.user.id, profileId, req.user.id];
		const profileBlogsSql = `
    SELECT a.id, c.id AS userId, c.username, c.img AS userImage ,a.text, a.img, a.views, a.created_at as createdAt, 
		(SELECT EXISTS(SELECT * FROM vt_likes WHERE user_id = ? AND blog_id = a.id AND comment_id is NULL)) AS likestatus,
		(SELECT COUNT(*) FROM vt_likes WHERE blog_id = a.id AND comment_id IS NULL) AS likes,
		(SELECT COUNT(*) FROM vt_comments WHERE blog_id = a.id) AS comments
		
		FROM vt_blogs AS a
		LEFT JOIN vt_users AS b 
		ON b.id = a.user_id
		LEFT JOIN vt_user_profile AS c
		ON c.id = b.inf_id
		WHERE b.id = ? AND (a.${`status`} = 1 OR c.id = ?)
		ORDER BY a.created_at DESC`;

		const connection = await getConnection();
		const [profiles] = await connection.query(profilesSql, profileData);
		const [blogs] = await connection.query(
			profileBlogsSql,
			profileBlogsData,
		);
		connection.release();

		const profile = profiles[0];
		profile.img = imageCheck(profile.img);
		profile.createdAt = timeDiff(profile.createdAt);

		blogs.map((blog) => {
			blog.createdAt = timeDiff(blog.createdAt);
			blog.userImage = imageCheck(blog.userImage);
			return blog;
		});

		res.render("profile", {
			page: "Profile",
			user: req.user,
			profile,
			blogs,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant render profile",
		});
	}
};

export const getSignin = async (req, res) => {
	res.render("signin", {
		page: "SignIn",
	});
};

export const postSignin = async (req, res) => {
	try {
		const { email, password } = req.body;

		const profileData = [email, password];
		const profilesSql = `
		SELECT id FROM vt_user_inf WHERE email = ? AND password = ?`;

		const connection = await getConnection();
		const [profile] = await connection.query(profilesSql, profileData);
		connection.release();

		if (!profile[0]) {
			return res.status(404).json({
				msg: "Wrong email or password",
			});
		}

		req.session.user = profile[0];

		res.status(200).json({
			msg: "You successfully signed",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cont signin you",
		});
	}
};

export const postSignup = async (req, res) => {
	try {
		const { username, email, password, password2 } = req.body;
		const createdAt = new Date();

		const checkData = [email];
		const checkSql = `
		SELECT EXISTS(SELECT * FROM vt_user_inf WHERE email = ?) AS check_data`;

		const profileData = [username, createdAt];
		const profileSql = `
		INSERT INTO vt_user_profile (username, created_at) VALUES (?, ?)`;

		const privateData = [email, password];
		const privatesSql = `
		INSERT INTO vt_user_inf (email, password) VALUES (?, ?)`;

		const userSql = `
		INSERT INTO vt_users (profile_id, inf_id) VALUES (?, ?)`;

		if (password != password2) {
			return res.status(400).json({
				msg: " Passwords don't match ",
			});
		}

		const connection = await getConnection();
		const [check] = await connection.query(checkSql, checkData);

		if (check[0].check_data == 1) {
			return res.status(400).json({
				msg: "That email address is already in use.",
			});
		}

		const [profile] = await connection.query(profileSql, profileData);
		const [inform] = await connection.query(privatesSql, privateData);

		const userData = [profile.insertId, inform.insertId];
		const [user] = await connection.query(userSql, userData);

		connection.release();


		req.session.user = { id: user.insertId };
		res.status(200).json({
			msg: "User created successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cont signin you",
		});
	}
};

export const postSubcribe = async (req, res) => {
	try {
		// db variables
		const id = req.user.id;
		const pofileId = parseInt(req.body.profileId);
		const status = req.body.status;

		const data = [pofileId, id];
		const sqlSubscribe = `INSERT INTO vt_subcribers (user_id, subscriber_id) VALUES (?, ?)`;
		const sqlUnsubscribe = `DELETE FROM vt_subcribers WHERE user_id = ? AND subscriber_id = ?`;

		const connection = await getConnection();
		if (status == "true") {
			await connection.query(sqlSubscribe, data);
			res.status(200).json({ msg: "Now you follow that user" });
		} else {
			await connection.query(sqlUnsubscribe, data);
			res.status(200).json({ msg: "Now you unfollow that user" });
		}
		connection.release();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, subcribe error",
		});
	}
};

export const getSettings = async (req, res) => {
	try {
		const profileId = req.user.id;

		const profileData = [profileId];
		const profilesSql = `
		SELECT prof.username, prof.img, prof.description, inf.name, inf.surname, inf.email
		FROM vt_user_profile AS prof
		LEFT JOIN vt_users AS user ON user.profile_id = prof.id
		LEFT JOIN vt_user_inf AS inf ON user.inf_id = inf.id
		WHERE user.id = ?`;

		const connection = await getConnection();
		const [profiles] = await connection.query(profilesSql, profileData);
		connection.release();

		const profile = profiles[0];
		profile.img = imageCheck(profile.img);
		profile.createdAt = timeDiff(profile.createdAt);

		res.render("settings", {
			page: "Settings",
			user: req.user,
			profile,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant render profile",
		});
	}
};

export const putImage = async (req, res) => {
	try {
		const userId = req.user.id;
		const image = req.file;

		if (!image) {
			return res.status(404).json({
				msg: "Image not found",
			});
		}
		const imagePath = "/uploads/profiles/" + image.filename;

		const oldImgData = [userId];
		const oldImgsSql = `
		SELECT img FROM vt_user_profile WHERE id = ?`;

		const newProfileData = [imagePath, userId];
		const newProfilesSql = `
		UPDATE vt_user_profile
		SET img = ?
		WHERE id = ?`;

		const connection = await getConnection();
		const [oldImg] = await connection.query(oldImgsSql, oldImgData);

		deleteFile(oldImg[0].img);

		await connection.query(newProfilesSql, newProfileData);
		connection.release();

		res.status(200).json({
			msg: "Image successful uploaded",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant put image",
		});
	}
};

export const putProfile = async (req, res) => {
	try {
		const userId = req.user.id;
		const username = req.body.username;
		const description = req.body.description;

		console.log(username, description);
		const profileData = [username, description, userId];
		const profilesSql = `
		UPDATE vt_user_profile
		SET 
		username = ?,
		DESCRIPTION = ? 
		WHERE id = ?`;

		const connection = await getConnection();
		await connection.query(profilesSql, profileData);
		connection.release();

		res.status(200).json({
			msg: "Profile successful updated",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant put profile",
		});
	}
};

export const putPrivate = async (req, res) => {
	try {
		const userId = req.user.id;
		const {
			firstName,
			lastName,
			email,
			currentPassword,
			newPassword,
			confirmPassword,
		} = req.body;

		const privateData = [firstName, lastName, email, newPassword, userId];
		const privateSql = `
		UPDATE vt_user_inf 
		SET 
		NAME = ?,
		surname = ?,
		email = ?
		${newPassword ? `,password = ?` : ""}
		WHERE id = ?`;

		const checkData = [email];
		const checkSql = `
		SELECT EXISTS(SELECT * FROM vt_user_inf WHERE email = ?) AS check_data`;

		const passCheckData = [currentPassword, userId];
		const passChecksSql = `
		SELECT EXISTS(SELECT * FROM vt_user_inf WHERE PASSWORD = ? AND id = ?) AS pass`;

		const connection = await getConnection();

		const [check] = await connection.query(checkSql, checkData);

		if (check[0].check_data == 1) {
			return res.status(400).json({
				msg: "That email address is already in use.",
			});
		}

		const [passcheck] = await connection.query(
			passChecksSql,
			passCheckData,
		);

		if (passcheck[0].pass == 0) {
			return res.status(400).json({
				msg: "Uncorrect password",
			});
		}

		if (newPassword) {
			if (newPassword != confirmPassword)
				return res.status(400).json({
					msg: " Passwords don't match ",
				});
		} else privateData.splice(3, 1);

		await connection.query(privateSql, privateData);
		connection.release();

		res.status(200).json({
			msg: "Private information successful updated",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant put private",
		});
	}
};
