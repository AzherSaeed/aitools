const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi }  = require('openai')


const configuration = new Configuration({
    apiKey: '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',
  });

  const openai = new OpenAIApi(configuration);





dotenv.config({path : './config.env'});

const app = express();
app.use(express.json())



app.use(cors())
app.options('*' , cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});



function generatePrompt(animal) {
    const capitalizedAnimal =
      animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.
  
      Animal: Cat
      Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
      Animal: Dog
      Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
      Animal: ${capitalizedAnimal}
      Names:`;
  }




//here is complete word api 
app.post('/checkWord' , async (req , res) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: generatePrompt(req.body.animal),
        temperature: 0.6,
      });
      res.status(200).json({ result: completion.data.choices[0].text });
})





// here is grammer correction api == complete
app.post('/grammerCorrection' , async (req , res) => {
  const {inputText} = req.body

  console.log(inputText , 'inputText');
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Correct this to standard English:\n\n${inputText}`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      res.status(200).json({ result: completion.data.choices[0].text });
})



//here is question answer
app.post('/questionAnswer' , async (req , res) => {
      const {inputText} = req.body
    const completion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: ${inputText}?\nA:`,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      });
      res.status(200).json({ result: completion.data.choices[0].text });
})




app.post('/summarizeContent' , async (req , res) => {
  const {inputText} = req.body
const completion =  await openai.createCompletion({
  model: "text-davinci-002",
  prompt: `Summarize this for a second-grade student:\n\n${inputText}.`,
  temperature: 0.7,
  max_tokens: 64,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
});
  res.status(200).json({ result: completion.data.choices[0].text });
})



app.post('/languageConvertion' , async (req , res) => {
  const {inputText} = req.body
const completion =  await openai.createCompletion({
  model: "text-davinci-002",
  prompt: `Translate this into 1. French, 2. Spanish and 3. Japanese:\n\n${inputText}?\n\n1.`,
  temperature: 0.3,
  max_tokens: 100,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
});
  res.status(200).json({ result: completion.data.choices[0].text });
})


app.post('/unstructuredData' , async (req , res) => {
  const {inputText} = req.body
const completion =  await openai.createCompletion({
  model: "text-davinci-002",
  prompt:  `A table summarizing the fruits from Goocrux:\n\n${inputText}.\n\n| Fruit | Color | Flavor |`,
  temperature: 0.3,
  max_tokens: 100,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
});
  res.status(200).json({ result: completion.data.choices[0].text });
})


app.post('/movieEmoji' , async (req , res) => {
  const {inputText} = req.body
const completion =  await openai.createCompletion({
  model: "text-davinci-002",
  prompt: `Convert movie titles into emoji.\n\nBack to the Future: 👨👴🚗🕒 \nBatman: 🤵🦇 \nTransformers: 🚗🤖 \n${inputText}:`,
  temperature: 0.8,
  max_tokens: 60,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  stop: ["\n"],
});
  res.status(200).json({ result: completion.data.choices[0].text });
})

app.post('/keywordsExtract' , async (req , res) => {
  const {inputText} = req.body
const completion = await openai.createCompletion({
  model: "text-davinci-002",
  prompt: `Extract keywords from this text:\n\n${inputText}.`,
  temperature: 0.3,
  max_tokens: 60,
  top_p: 1.0,
  frequency_penalty: 0.8,
  presence_penalty: 0.0,
});
  res.status(200).json({ result: completion.data.choices[0].text });
})





const port =  process.env.PORT ||  8086;

app.get('/', (req, res) => res.send('Hello World'))


app.listen(port , () => console.log(`Server is running in ${process.env.APP_ENV} mode on port ${port}`) )