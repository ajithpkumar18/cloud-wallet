import mongoose, { connect, mongo } from "mongoose";

mongoose.connect("mongodb://localhost:27017/walletdb");

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	privateKey: String,
	publicKey: String,
});

export const userModel = mongoose.model("User", userSchema);
