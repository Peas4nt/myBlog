import express from "express";
import connection from "./db.js";

const PORT = process.env.PORT ?? 3000
const app = express()



app.listen(PORT, (err) => {
	if (err) return console.log(err);
	console.log(`Server OK\nhttp://localhost:${PORT}/`);
});