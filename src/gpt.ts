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

const cretaePromptAfterWithURL = async (url: string) => {
    const textData = await getTextsDataFromLP(url);
    
}


export const accessToChatGPT = async (prompt: string) => {
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