import path from "path";
import express from "express";
import { accessToChatGPT } from "./gpt";

const app = express();

const port = 3000;

app.public(express.static(path.join(__dirname, "public")));




app.post("/create-prompt", async (req, res) => {
    const body = req.body;
    
    const promptFirst = ""
    const url = ""

    const prompt = promptFirst + ;
    accessToChatGPT(prompt);
})


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`);
})