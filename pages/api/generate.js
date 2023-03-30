import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid topic",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
      max_tokens: 1000,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Generate a tweet which will drive conversion based on this company profile and the input topic. Include hashtags.

  Koillectible NFTs is a fundraising platform that links NFTs with physical assets such as livestock, fruits, and vegetables, providing digital security and authenticity. It offers a versatile funding vessel to tokenize assets for a wide range of industries. The Koi NFT platform enables the ownership and trading of physical assets like Koi through an accessible and easy process, creating mutually beneficial opportunities for both creators and investors. It offers various NFTs for different types of physical assets, including Feeder and Manager NFTs for attaching Koi NFTs to physical Koi.

  Topic: invite creators to webinar
  Tweet: Calling all creators (again)! Still eager to learn how to drop your project on OpenSea? You're in luck! We're hosting our second webinar with a live walkthrough of our new drops platform. The webinar will be on Wednesday, March 29, at 3PM EST. Register now!
  Topic: NFTs at the Louvre
  Tweet: Apes in the Louvre. Europe is so far ahead on crypto it’s not even funny.

Topic: ${capitalizedAnimal}
Tweet:`;
}
