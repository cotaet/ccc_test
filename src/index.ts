import fs from "fs";

import path from "path";
import express from "express";
import { accessToChatGPT, createPromptAfterWithURL, getBetweenJPBrackets } from "./gpt";

const app = express();

const port = 3000;

app.use((express.static(path.join(__dirname, "public"))));
app.use(express.json());


app.post("/gpt", async (req, res) => {
    const body: {promptFirst: string, url: string} = req.body;

    const {promptFirst, url} = body;
    console.log(body);

    const prompt = promptFirst + `\n\n\n` + await createPromptAfterWithURL(url);
    const GPTResult = (await accessToChatGPT(prompt)) || "";
    const copyResult = GPTResult.split("\n").map(text => getBetweenJPBrackets(text) || "コピー取得失敗");

    
    fs.writeFileSync(path.join(__dirname, "results.txt"), JSON.stringify({prompt, GPTResult, copyResult}));
    res.json({prompt, GPTResult, copyResult});
})


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port}`);
})