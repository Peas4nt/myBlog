import { getConnection } from "../../db.js";
import timeDiff from "../../utils/timeDiff.js";
import imageCheck from "../../utils/getUserImg.js";

export const getOne = async (req, res) => {
	try {
		const userId = req.user.id;
		const commentId = req.params.id;

		const commentViewData = [commentId];
		const commentViewSql = `
		UPDATE vt_comments
		SET views = views + 1
		WHERE id = ?
		`;

		const commentsData = [userId, userId, commentId];
		const cmmentsSql = `
		SELECT 
		u1.id AS userId,
			u_inf1.username,
			u_inf1.img AS userImage,
			c1.id, 
			c1.text,
			c1.blog_id,
			c1.comment_id,
			c1.views,
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
		WHERE c1.id = ?
		GROUP BY c1.id
		ORDER BY likes DESC;
		`;

		const connection = await getConnection();
		// view++
		await connection.query(commentViewSql, commentViewData);
		// get blog comments
		const [comments] = await connection.query(cmmentsSql, commentsData);
		connection.release();

		if (comments.length > 0) {
			const comm = comments[0];
			comm.created_at = timeDiff(comm.created_at);
			comm.userImage = imageCheck(comm.userImage);

			comm.responses = JSON.parse(comm.responses);
			// console.log(comm.responses);
			if (comm.responses[0].userId != null) {
				comm.responses.map((childComm) => {
					childComm.created_at = timeDiff(childComm.created_at);
					childComm.userImage = imageCheck(childComm.userImage);

					return childComm;
				});
			} else comm.responses = [];

			res.render("oneComment", {
				page: `comment ${commentId}`,
				user: req.user,
				comm,
			});
		} else {
			res.status(404).json({ msg: "Comment not found" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant open comment.",
		});
	}
};

export const postCreate = async (req, res) => {
	try {
		// comment variables
		const id = req.user.id;
		const text = req.body.text;
		const blogId = req.body.blogId;
		const commentId = req.body.commentId ? req.body.commentId : null;
		const createAt = new Date();

		// db variables
		const data = [id, blogId, commentId, text, createAt];
		const sql = `INSERT INTO vt_comments (user_id, blog_id, comment_id, text, created_at)
    VALUES (?, ?, ?, ?, ?);`;

		const connection = await getConnection();
		const [result] = await connection.query(sql, data);
		connection.release();

		res.json({
			msg: "Comment created successufully.",
			commentId: result.insertId,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Server error, server cant create comment.",
		});
	}
};

export const update = (req, res) => {};

export const remove = async (req, res) => {
	try {
		const userId = req.user.id;
		const commId = req.body.commId;

		const ownerCheckData = [commId, userId];
		const ownerChecksSql = `
		SELECT EXISTS(SELECT * FROM vt_comments WHERE id = ? AND user_id = ?) AS owner`;

		const commDeleteData = [commId];
		const commDeletSql = `
		DELETE FROM vt_comments WHERE id = ?`;

		const connection = await getConnection();
		const [owner] = await connection.query(ownerChecksSql, ownerCheckData);

		// owner check
		if (owner[0].owner == 0) {
			return res.status(404).json({
				msg: "You are not a comment owner.",
			});
		}

		await connection.query(commDeletSql, commDeleteData);
		connection.release();

		res.status(200).json({
			msg: "Comment deleted successfully",
		});
		console.log(`User: ${userId} delete comment ${commId}`);
	} catch (error) {
		res.status(500).json({
			msg: "Server error, cant remove comment",
		});
	}
};
