import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import "./App.css";
import {
	Transaction,
	Connection,
	PublicKey,
	SystemProgram,
	LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import axios from "axios";

function App() {
	const [data, setData] = useState({ amount: 0, address: "" });
	const [con, setCon] = useState<Connection | null>(null);
	const url = import.meta.env.VITE_RPC;
	useEffect(() => {
		const connection = new Connection(url, "confirmed");
		setCon(connection);
		console.log(url);
	}, []);
	const HandleInput = (e: ChangeEvent<HTMLInputElement>) => {
		setData((d) => ({ ...d, [e.target.name]: e.target.value }));
		console.log(data);
	};

	const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
		e.preventDefault();

		// console.log(data);
		const instruction = SystemProgram.transfer({
			fromPubkey: new PublicKey(
				"E4iDMUxfmNZUMNVuLwGQLumiCDaETEc5ug3ztAfFFCRs"
			),
			toPubkey: new PublicKey(
				"HPmRdYv4Ap1aFVG1tgC4qoE9PcpaVibRSUSspxHeyMST"
			),

			lamports: 0.001 * LAMPORTS_PER_SOL,
		});
		const block = await con?.getLatestBlockhash("processed");
		const blockhash = block?.blockhash;
		const txn = new Transaction().add(instruction);
		txn.recentBlockhash = blockhash;
		txn.feePayer = new PublicKey(
			"E4iDMUxfmNZUMNVuLwGQLumiCDaETEc5ug3ztAfFFCRs"
		);

		// convert transaction to a bunch of bytes
		const serializedTxn = txn.serialize({
			requireAllSignatures: false,
			verifySignatures: false,
		});

		console.log(serializedTxn);
		axios.post("/api/v1/txn/sign", {
			message: serializedTxn,
			retry: false,
		});

		console.log("submitted");
	};

	return (
		<>
			<div>
				<input
					type='number'
					placeholder='Amount'
					name='amount'
					onChange={HandleInput}
				/>
				<input
					type='text'
					placeholder='Address'
					name='address'
					onChange={HandleInput}
				/>
				<button type='button' onClick={handleSubmit}>
					Send
				</button>
			</div>
		</>
	);
}

export default App;
