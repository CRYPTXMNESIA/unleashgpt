import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import clipboardCopy from 'clipboard-copy';
import './App.css';
import optionsJSON from './options.json';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [darkMode] = useState(localStorage.getItem("darkMode") !== "false");
  const [prompt, setPrompt] = useState("");
  const [jailbreakName, setJailbreakName] = useState(localStorage.getItem("lastSelectedJailbreak") || "Bagley");  const [buttonText, setButtonText] = useState("Combine + Copy");
  const [topPrompt, setTopPrompt] = useState("");
  const [options] = useState(optionsJSON);
  const textAreaRef = useRef(null);
  const [scrollTrigger, setScrollTrigger] = useState(false);
  const [savedPromptsVisible, setSavedPromptsVisible] = useState(false);
  const [jailbreakListOpen, setJailbreakListOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("lastSelectedJailbreak", jailbreakName);
  }, [jailbreakName]);

  useEffect(() => {
    document.title = "UnleashGPT - " + jailbreakName;
  }, [jailbreakName]);

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

  const [savedPrompts, setSavedPrompts] = useState([]);

  useEffect(() => {
    // Load saved prompts from local storage when initializing state
    const savedData = localStorage.getItem("savedPrompts");
    setSavedPrompts(savedData ? JSON.parse(savedData) : []);
  }, []);

  useEffect(() => {
    // Save saved prompts to local storage whenever they change
    localStorage.setItem("savedPrompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);

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

  const savePrompts = newPrompts => {
    setSavedPrompts(newPrompts);
    localStorage.setItem("savedPrompts", JSON.stringify(newPrompts));
  };

  const addSavedPrompt = (name, topPrompt, prompt) => {
    const newPrompt = { name, topPrompt, prompt };
    setSavedPrompts(prevPrompts => {
      const newPrompts = [...prevPrompts, newPrompt];
      localStorage.setItem("savedPrompts", JSON.stringify(newPrompts));
      return newPrompts;
    });
  };

  const deleteSavedPrompt = index => {
    setSavedPrompts(prevPrompts => {
      const newSavedPrompts = [...prevPrompts];
      newSavedPrompts.splice(index, 1);
      localStorage.setItem("savedPrompts", JSON.stringify(newSavedPrompts));
      return newSavedPrompts;
    });
  };

  const handleJailbreakSelection = (selectedOption) => {
    setJailbreakName(selectedOption);
    setPrompt(options[selectedOption] || '');
    setSavedPromptsVisible(false); // This will switch back to the main page
  };

  const handleNameChange = (event, index) => {
    setSavedPrompts(prevPrompts => {
      const newSavedPrompts = [...prevPrompts];
      newSavedPrompts[index].name = event.target.value;
      localStorage.setItem("savedPrompts", JSON.stringify(newSavedPrompts));
      return newSavedPrompts;
    });
  };

  const copySavedPrompt = index => {
    const { topPrompt, prompt } = savedPrompts[index];
    clipboardCopy(topPrompt + prompt);
  };

  const handleDiscordClick = () => {
    window.location.href = 'https://discord.gg/pcNyW8H3st';
    window.open('https://discord.gg/k8yNYxJ6A5', '_blank');
  }

  return (
    <div className={darkMode ? "appWrapperDark" : "appWrapper"}>
    <div class="slider-thumb"></div>
    <Analytics />
        
        {/* Conditional rendering based on the visibility of the jailbreak list */}
        {jailbreakListOpen ? (
            <>
                <h1>Menu</h1>
                <div className="jailbreakBar">
                    <div className="selectedJailbreakText" onClick={() => setJailbreakListOpen(!jailbreakListOpen)}>
                        {jailbreakName}
                    </div>
                    <button className="jbBtn" onClick={() => setJailbreakListOpen(!jailbreakListOpen)}>
                        Close Jailbreak Menu
                    </button>
                </div>

                <div className="fullJailbreakList">
                  {Object.keys(options).map((option) => (
                      <div key={option} className="jailbreakItem" onClick={() => {
                          setJailbreakName(option);
                          setPrompt(options[option] || '');
                          setJailbreakListOpen(false); // Close the list after selection
                      }}>
                          {option}
                      </div>
                  ))}
              </div>
            </>
        ) : (
            <>
                <h1>{savedPromptsVisible ? "Saved Prompts" : "UnleashGPT"}</h1>

                <div className="jailbreakBar">
                    <div className="selectedJailbreakText">
                        {jailbreakName}
                    </div>
                    <button className="jbBtn" onClick={() => setJailbreakListOpen(!jailbreakListOpen)}>
                      Open Jailbreak Menu
                    </button>
                </div>

                <button className="saveMenu" onClick={() => setSavedPromptsVisible(!savedPromptsVisible)}>
                  {savedPromptsVisible ? "Close Saved Prompts" : "Open Saved Prompts"}
                </button>
                <div className={`savedPrompts ${savedPromptsVisible ? '' : 'hidden'}`}>
                    <ul className="savedPromptsList">
                        {savedPrompts.map(({ name, topPrompt, prompt }, index) => (
                            <li key={index} className="savedPromptItem">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => handleNameChange(e, index)}
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
                        <p className="characterCount">{prompt.length} / 4096 characters</p>
                        <button onClick={handleGenerate} className={darkMode ? "genButtonDark" : "genButton"}>{buttonText}</button>
                        <button className={darkMode ? "discordButtonDark" : "discordButton"} onClick={handleDiscordClick}>
                            <FontAwesomeIcon icon={faDiscord} size="8x" color={'#ffffff'} />
                        </button>
                    </>
                )}
            </>
        )}

    </div>
);
}

export default App;