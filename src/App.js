import React, { useState, useEffect } from "react";
import clipboardCopy from 'clipboard-copy';
import './App.css'; 
import optionsJSON from './options.json'; // Import JSON file

function App() {
  const [darkMode] = useState(localStorage.getItem("darkMode") !== "false");
  const [prompt, setPrompt] = useState("");
  const [jailbreakName, setJailbreakName] = useState("DEVELOPER MODE");
  const [options, setOptions] = useState({}); // New state variable for options
  const [buttonText, setButtonText] = useState("Generate");

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Load the options from the JSON file
  useEffect(() => {
    setOptions(optionsJSON);
  }, []);

  const handleGenerate = () => {
    let generatedText = "";

    switch(jailbreakName) {
      case "DEVELOPER MODE":
        generatedText = `${options['DEVELOPER MODE'] || ''}${prompt}`;
        break;
      case "BETTER DAN":
        generatedText = `${options['BETTER DAN'] || ''}${prompt}`;
        break;
      case "DEVIL'S ADVOCATE":
        generatedText = ` ${options["DEVIL'S ADVOCATE"] || ''}${prompt}`;
        break;
      case "COMPULSIVE LIAR":
        generatedText = `${options['COMPULSIVE LIAR'] || ''}${prompt}`;
        break;
      case "2-WAY CONVERSATION":
        generatedText = `${options['2-WAY CONVERSATION'] || ''}${prompt}`;
        break;
      case "3-RD PERSON CONVERSATION":
        generatedText = `${options['3-RD PERSON CONVERSATION'] || ''}${prompt}`;
        break;
      case "LITTLEGPT":
        generatedText = `${options['LITTLEGPT'] || ''}${prompt}`;
        break;
      case "AIMBOT":
        generatedText = `${options['AIMBOT'] || ''}${prompt}`;
        break;
      case "POLITICALGPT":
        generatedText = `${options['POLITICALGPT'] || ''}${prompt}`;
        break;
      case "METHBAKE":
        generatedText = `${options['METHBAKE'] || ''}${prompt}`;
        break;
      case "CONSPIRACYGPT":
        generatedText = `${options['CONSPIRACYGPT'] || ''}${prompt}`;
        break;
      default:
        break;
    }

    clipboardCopy(generatedText);
  
  setButtonText("Copied!");
  
  setTimeout(() => {
    setButtonText("Generate");
  }, 2000);  // Change back to "Generate" after 2 seconds
};

  return (
    <div className={darkMode ? "appWrapperDark" : "appWrapper"}>
      <h1>UnleashGPT</h1>
      <div className="header">
        <select 
          className={darkMode ? "selectDark" : "select"}
          value={jailbreakName} 
          onChange={e => setJailbreakName(e.target.value)}
        >
          <option value="DEVELOPER MODE">Developer Mode</option>
          <option value="BETTER DAN">Better DAN</option>
          <option value="DEVIL'S ADVOCATE">Devil's Advocate</option>
          <option value="COMPULSIVE LIAR">Compulsive Liar</option>
          <option value="2-WAY CONVERSATION">2-Way Conversation</option>
          <option value="3-RD PERSON CONVERSATION">3rd Person Conversation</option>
          <option value="LITTLEGPT">LittleGPT</option>
          <option value="AIMBOT">AimBot</option>
          <option value="POLITICALGPT">PoliticalGPT</option>
          <option value="METHBAKE">Methbake</option>
          <option value="CONSPIRACYGPT">ConspiracyGPT</option>
        </select>
      </div>
      <textarea 
        className={darkMode ? "textareaDark" : "textarea"}
        value={prompt} 
        onChange={e => setPrompt(e.target.value)} 
        maxLength={4096}
      />
      <p className="characterCount">{prompt.length} / 4096 characters</p>
      <button onClick={handleGenerate} className={darkMode ? "genButtonDark" : "genButton"}>{buttonText}</button>
    </div>
  );
}

export default App;