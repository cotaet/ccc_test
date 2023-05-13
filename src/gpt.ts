import request from "request";
import cheerio from "cheerio";
import { Configuration, OpenAIApi } from "openai";

interface TextData {
    title: string,
    description: string,
    texts: string
}


const getTextsDataFromLP = (url: string): Promise<TextData> =>  {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            if (error || response.statusCode !== 200) {
                reject(error);
            } else {
                const $ = cheerio.load(html);
                const title = $('title').text();
                const description = $('meta[name="description"]').attr('content') || "";
                $('script, style, noscript').remove();
                const texts = $('body').text();
                resolve({title, description, texts});
            }
        });
    });
};

const replaceRepeatSpecialLetter = (text: string) => {
    return text.replace(/\n+/g, "\n").replace(/\t+/g, "\t").replace(/ +/g, " ");
}

export const createPromptAfterWithURL = async (url: string) => {
    const textData = await getTextsDataFromLP(url);
    const promptAfter = `title: ${textData.title}\ndescription: ${textData.description}\ntext要素の最初の部分: ${replaceRepeatSpecialLetter(textData.texts).slice(0, 1000)}`;
    return promptAfter;
}


export const accessToChatGPT = async (prompt: string) => {
    return "ここに結果"
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    // const response = await openai.listEngines();

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });
    return completion.data.choices[0].message?.content;
}


export const getBetweenJPBrackets = (text: string) => {
    const regex = /「(.*?)」/; // 「」の中身をキャプチャする正規表現

    const result = regex.exec(text);
    if (result && result[1]) {
        const extracted = result[1];
        return extracted;
    }
    return "";
}