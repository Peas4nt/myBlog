import express from "express";
import { testConnection } from "./db.js";
import * as blogController from "./controllers/blogController.js";

import dotenv from "dotenv";
dotenv.config();

// servera ports
const PORT = process.env.PORT ?? 3000;
// create express aplication
const app = express();

// website render tool
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", blogController.getCreate)

// start server function
const start = async () => {
	// check db connection
	const dbErr = await testConnection();
	if (dbErr) return console.error("DB error: ",dbErr);

	app.listen(PORT, (err) => {
		// check server errors
		if (err) return console.error("Server errror: ",err);
		console.log(`Server OK\nhttp://localhost:${PORT}/`);
	});
};

start();
