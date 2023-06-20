import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import clipboardCopy from 'clipboard-copy';
import './App.css'; 
import optionsJSON from './options.json';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [darkMode] = useState(localStorage.getItem("darkMode") !== "false");
  const [prompt, setPrompt] = useState("");
  const [jailbreakName, setJailbreakName] = useState("DEVELOPER MODE");
  const [buttonText, setButtonText] = useState("Combine + Copy");
  const [topPrompt, setTopPrompt] = useState("");
  const [options] = useState(optionsJSON);
  const textAreaRef = useRef(null);
  const [scrollTrigger, setScrollTrigger] = useState(false);  
  const [savedPromptsVisible, setSavedPromptsVisible] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const selectedOption = options[jailbreakName] || '';
    setPrompt(selectedOption + topPrompt);
    setScrollTrigger(true);  
  }, [topPrompt, jailbreakName]);

  useEffect(() => {
    if (scrollTrigger) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
      setScrollTrigger(false);  
    }
  }, [scrollTrigger]); 

  useEffect(() => {
    textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
  }, []);

  useEffect(() => {
    // Save saved prompts to local storage whenever they change
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);  // Add this line

  const [savedPrompts, setSavedPrompts] = useState(() => {
    // Load saved prompts from local storage when initializing state
    const savedData = localStorage.getItem("savedPrompts");
    return savedData ? JSON.parse(savedData) : [];
  });

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

  const addSavedPrompt = (name, topPrompt, prompt) => {
    const newPrompt = { name, topPrompt, prompt };
    setSavedPrompts(prevPrompts => [...prevPrompts, newPrompt]);
  };
  
  const deleteSavedPrompt = index => {
    setSavedPrompts(prevPrompts => {
      const newSavedPrompts = [...prevPrompts];
      newSavedPrompts.splice(index, 1);
      return newSavedPrompts;
    });
  };
  
  const copySavedPrompt = index => {
    const { topPrompt, prompt } = savedPrompts[index];
    clipboardCopy(topPrompt + prompt);
  };  

  return (
    <div className={darkMode ? "appWrapperDark" : "appWrapper"}>
      <h1>{savedPromptsVisible ? "Saved Prompts" : "UnleashGPT"}</h1>
      {!savedPromptsVisible && 
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
            <option value="RIKA">Rika</option>
          </select>
        </div>
      }
      <button className="saveMenu" onClick={() => setSavedPromptsVisible(!savedPromptsVisible)}>
        <FontAwesomeIcon icon={savedPromptsVisible ? faArrowUp : faArrowDown} />
      </button>
      <div className={`savedPrompts ${savedPromptsVisible ? '' : 'hidden'}`}>
      <ul className="savedPromptsList">
        {savedPrompts.map(({ name, topPrompt, prompt }, index) => (
          <li key={index} className="savedPromptItem">
            <input
              type="text"
              value={name}
              onChange={e => {
                const newSavedPrompts = [...savedPrompts];
                newSavedPrompts[index].name = e.target.value;
                setSavedPrompts(newSavedPrompts);
              }}
              className="savedPromptInput"
            />
            <button onClick={() => deleteSavedPrompt(index)} className="savedPromptButton">Delete</button>
            <button onClick={() => copySavedPrompt(index)} className="savedPromptButton">Copy</button>
          </li>
        ))}
      </ul>
      <button className="saveButton" onClick={() => addSavedPrompt('New prompt', topPrompt, prompt)}>
        Save current prompt
      </button>
    </div>
      {savedPromptsVisible ? null : (
        <>
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
          <p className="characterCount">{(prompt.length)} / 4096 characters</p>      
          <button onClick={handleGenerate} className={darkMode ? "genButtonDark" : "genButton"}>{buttonText}</button>
          <button className={darkMode ? "discordButtonDark" : "discordButton"} onClick={() => window.open('https://discord.gg/aichat', '_blank')}>
            <FontAwesomeIcon icon={faDiscord} size="8x" color={'#ffffff'} />
          </button>
        </>
      )}
    </div>
  );
}

export default App;