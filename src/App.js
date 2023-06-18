import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import clipboardCopy from 'clipboard-copy';
import './App.css'; 
import optionsJSON from './options.json'; 

function App() {
  const [darkMode] = useState(localStorage.getItem("darkMode") !== "false");
  const [prompt, setPrompt] = useState("");
  const [jailbreakName, setJailbreakName] = useState("DEVELOPER MODE");
  const [buttonText, setButtonText] = useState("Generate");
  const [topPrompt, setTopPrompt] = useState("");
  const [options] = useState(optionsJSON);
  const textAreaRef = useRef(null);
  const [scrollTrigger, setScrollTrigger] = useState(false);  // new state variable

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const selectedOption = options[jailbreakName] || '';
    setPrompt(selectedOption + topPrompt);
    setScrollTrigger(true);  // trigger scroll effect
  }, [topPrompt, jailbreakName]);

  useEffect(() => {
    if (scrollTrigger) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
      setScrollTrigger(false);  // reset trigger
    }
  }, [scrollTrigger]);  // scroll effect runs when scrollTrigger changes

  useEffect(() => {
    textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
  }, []);

  const handleSelectChange = e => {
    const selectedOption = e.target.value;
    setJailbreakName(selectedOption);
    setPrompt(options[selectedOption] || '');
  };

  const handleGenerate = () => {
    let optionPrefix = options[jailbreakName] || '';
    let generatedText = optionPrefix + topPrompt;

    clipboardCopy(generatedText);

    setButtonText("Copied!");

    setTimeout(() => {
        setButtonText("Combine + Copy");
    }, 2000);
  };

  return (
    <div className={darkMode ? "appWrapperDark" : "appWrapper"}>
      <h1>UnleashGPT</h1>
      <div className="header">
        <select 
          className={darkMode ? "selectDark" : "select"}
          value={jailbreakName} 
          onChange={handleSelectChange}
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
            <option value="MONGO TOM">Mongo Tom</option>
        </select>
      </div>
      <textarea 
        className={darkMode ? "textareaDark" : "textarea"}
        value={topPrompt} 
        onChange={e => setTopPrompt(e.target.value)}
      />
      <textarea 
        ref={textAreaRef}
        className={darkMode ? "textareaDark" : "textarea"}
        value={prompt} 
        onChange={e => setPrompt(e.target.value)} 
        maxLength={4096}
      />
      <p className="characterCount">{(topPrompt.length + prompt.length)} / 4096 characters</p>
      <button onClick={handleGenerate} className={darkMode ? "genButtonDark" : "genButton"}>{buttonText}</button>
      <button className={darkMode ? "discordButtonDark" : "discordButton"} onClick={() => window.open('https://discord.gg/aichat', '_blank')}>
        <FontAwesomeIcon icon={faDiscord} size="8x" color={'#ffffff'} /> {/* Adjust size here */}
      </button>
    </div>
  );
}

export default App;
