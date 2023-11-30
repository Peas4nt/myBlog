import mysql from "mysql2/promise";

// db connection
const connection = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "usersdb",
	password: "",
});

// Test the connection
connection
	.then((conn) => {
		console.log("Connection successful");
		return conn;
	})
	.catch((err) => {
		console.error("DB Error: " + err.message);
	});

// Export the connection
export default connection;
