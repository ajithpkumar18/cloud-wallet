import express from "express";
import bcrypt from "bcrypt";
import { userModel } from "./models/models.js";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import jwt from "jsonwebtoken";
import bs58 from "bs58";
const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
	const { name, password } = req.body;

	const keypair = new Keypair();
	try {
		const user = await userModel.find({ name });
		console.log(user, user.length);

		if (user.length > 0) {
			const yes = bcrypt.compareSync(
				password,
				user[0]?.password as string
			);
			if (yes) {
				res.status(401).json({ message: "User already exists" });
				return;
			}
		} else {
			const hashedPSWD = bcrypt.hashSync(password, 3);
			userModel.create({
				username: name,
				password: hashedPSWD,
				publicKey: keypair.publicKey.toString(),
				privateKey: keypair.secretKey.toString(),
			});
			res.status(200).json({
				message: "User Created",
				publicKey: keypair.publicKey,
			});
			return;
		}
	} catch (err) {
		res.status(401).json({ message: "Encountered error" + err });
		console.log(err);

		return;
	}

	res.send("Signup");
	return;
});
app.post("/signin", async (req, res) => {
	const { name, password } = req.body;
	try {
		const user = await userModel.find({ username: name });
		console.log(user[0], user.length);

		if (user.length > 0) {
			const yes = bcrypt.compareSync(
				password,
				user[0]?.password as string
			);
			console.log(yes, password, user[0]?.password);
			if (yes) {
				console.log(yes);
				const token = jwt.sign(
					{
						id: user[0]?._id,
						name: user[0]?.username,
					},
					"qewrstrwdftefd"
				);
				res.status(200).json({ token: token });

				return;
			}
		}
		res.send("Incorrect credentials");
		return;
	} catch (err) {
		res.status(401).json({ message: "Encountered error" + err });
		console.log(err);
		return;
	}
});

app.post("/api/v1/txn/sign", async (req, res) => {
	const serializedTransaction = req.body.message;
	const pubKey = req.body.pubKey;
	const tx = Transaction.from(serializedTransaction);
	// const user = await userModel.findOne({ PublicKey: pubKey });
	// const privateKey = user?.privateKey;

	const keyPair = Keypair.fromSecretKey(bs58.decode(""));
	tx.sign(keyPair);
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
