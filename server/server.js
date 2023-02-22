import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
// import fs from "fs";
import { promises as fs } from 'fs';

dotenv.config();
console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "hello world",
  });
});

app.post("/add", async (req, res) => {
  try {
    const key1 = req.body.key1;
    const prompt = req.body.prompt;
    console.log(key1, prompt);
    const data = await fs.readFile("prompts.json");
    const allPrompts = JSON.parse(data);
    // allPrompts[key1]=prompt;
    allPrompts["/"+key1.trim()] = prompt.trim();
    console.log(key1.trim().length);
    console.log(prompt.trim().length);
    var newData2 = JSON.stringify(allPrompts);
    fs.writeFile("prompts.json", newData2, (err) => {
      // Error checking
      if (err) throw err;
      console.log("New data added");
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    // fs.readFile("prompts.json", function(err, data) {
    //   if (err) throw err;
    //   const allPrompts = JSON.parse(data);
    //   p = allPrompts[prompt.trim()];
    //   console.log(p,"Sslkdkl");
    // });
    const data = await fs.readFile("prompts.json");
    const allPrompts = JSON.parse(data);

    // const p = allPrompts[prompt.trim()];

    let str0 = prompt.split(" ")[0]
    let str1 = prompt.split(" ").slice(1).join(" ")
    console.log(str0.trim().length);
    console.log(str1.trim());
    console.log(allPrompts[str0.trim()]);

    let p;
    if(str1.trim()!==undefined || allPrompts[str0]!=undefined){
      p = str1.trim() + " " + allPrompts[str0.trim()];
    }
    // console.log(p);

    if(allPrompts[str0.trim()]!==undefined){
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${p}`,
        temperature: 0, // Higher values means the model will take more risks.
        max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        top_p: 1, // alternative to sampling with temperature, called nucleus sampling
        frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
        presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
      });
  
      res.status(200).send({
        bot: response.data.choices[0].text,
      });
    }else{
      res.status(200).send({
        bot: "Ask me something in the defined prompts",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
