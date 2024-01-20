import express from "express";
import session from "express-session";
import { testConnection } from "./db.js";
import dotenv from "dotenv";
import pagesRoutes from './routes/pagesRoutes.js';

dotenv.config();

const PORT = process.env.PORT ?? 3000;
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(
	session({
		secret: "qwerty",
		resave: false,
		saveUninitialized: false,
	}),
);

app.use('/', pagesRoutes);

const start = async () => {
	const dbErr = await testConnection();
	if (dbErr) return console.error("DB error: ", dbErr);

	app.listen(PORT, (err) => {
		if (err) return console.error("Server errror: ", err);
		console.log(`Server OK\nhttp://localhost:${PORT}/`);
	});
};

start();
