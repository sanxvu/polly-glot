import { useState } from "react";
import "./App.css";
import OpenAI from "openai";
import worldmap from "./assets/worldmap.png";
import parrot from "./assets/parrot.png";
import frenchFlag from "./assets/fr-flag.png";
import spanishFlag from "./assets/sp-flag.png";
import japaneseFlag from "./assets/jpn-flag.png";

export default function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  const [translated, setTranslated] = useState(false);
  const [translation, setTranslation] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function translate() {
    if (translated) {
      setText("");
      setLanguage("");
      setTranslated(false);
      setTranslation("");
      return;
    }

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "user",
          content: `You are a translator. Provide the correct translation of "${text}" in ${language}. Only provide the ${language} translation.`,
        },
      ],
    });
    setTranslation(completion.choices[0].message.content);
    console.log(completion.choices[0].message);

    setTranslated(true);
  }

  return (
    <>
      <div className="card">
        <div className="header">
          <img className="worldmap" src={worldmap} />
          <div className="header-content">
            <img className="parrot" src={parrot}></img>
            <div className="header-text">
              <h1>PollyGlot</h1>
              <p>Perfect Translation Every Time</p>
            </div>
          </div>
        </div>

        <h2>Text to translate</h2>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your text here..."
        />

        {!translated ? (
          <>
            <h2>Select language</h2>
            <label>
              <input
                type="radio"
                name="language"
                value="french"
                onChange={(e) => setLanguage(e.target.value)}
              />{" "}
              French
              <img className="flag-icon" src={frenchFlag} />
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="language"
                value="spanish"
                onChange={(e) => setLanguage(e.target.value)}
              />{" "}
              Spanish
              <img className="flag-icon" src={spanishFlag} />
            </label>
            <br />
            <label>
              <input
                type="radio"
                name="language"
                value="japanese"
                onChange={(e) => setLanguage(e.target.value)}
              />{" "}
              Japanese
              <img className="flag-icon" src={japaneseFlag} />
            </label>
          </>
        ) : (
          <>
            <h2>Your translation</h2>
            <div className="translation-display">
              {translation && translation}
            </div>
          </>
        )}

        <button className="translate-button" onClick={() => translate()}>
          {!translated ? "Translate" : "Start Over"}
        </button>
      </div>
    </>
  );
}
