import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

// Create poll connection
const pool = mysql.createPool({
	host: process.env.HOST,
	user: process.env.USER,
	database: process.env.DBNAME,
	password: process.env.PASSWORD,
	waitForConnections: true,
	connectionLimit: 5,
	queueLimit: 0
});

export const testConnection = async () => {
	try {
		const [rows] = await pool.query('SELECT 1 + 1 AS solution');
		console.log("DB connection successful");
	} catch (error) {
		return error
	}
}

// Get db pool connection
export const getConnection = async () => {
	return await pool.getConnection();
};
