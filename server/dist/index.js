import express from "express";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.send("hello world");
    return;
});
app.post("/signup", (req, res) => {
    const { name, password } = req.body;
    console.log(name, password);
    res.send("Signup");
    return;
});
app.listen("3001", () => {
    console.log("Server running");
});
//# sourceMappingURL=index.js.map