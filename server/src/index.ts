import express from "express";
import bcrypt from "bcrypt";
import { userModel } from "./models/models.js";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
	const { name, password } = req.body;
	try {
		const user = await userModel.find({ name });
		const yes = bcrypt.compareSync(password, user[0]?.password as string);
		if (yes) {
			res.status(401).json({ message: "User already exists" });
			return;
		} else {
			userModel.create({ name, password });
		}
	} catch (err) {
		res.status(401).json({ message: "Encountered error" + err });
		console.log(err);

		return;
	}

	res.send("Signup");
	return;
});
app.post("/signin", (req, res) => {
	const { name, password } = req.body;
	console.log(name, password);
	res.send("Signup");
	return;
});
app.post("/api/v1/txn/sign", (req, res) => {
	const { name, password } = req.body;
	console.log(name, password);
	res.send("Signup");
	return;
});
app.post("/api/v1/txn", (req, res) => {
	const { name, password } = req.body;
	console.log(name, password);
	res.send("Signup");
	return;
});

app.listen("3001", () => {
	console.log("Server running");
});
