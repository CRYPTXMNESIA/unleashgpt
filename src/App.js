import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import clipboardCopy from 'clipboard-copy';
import './App.css';
import optionsJSON from './options.json';
import { Analytics } from '@vercel/analytics/react';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  const [darkMode] = useState(localStorage.getItem("darkMode") !== "false");
  const [prompt, setPrompt] = useState("");
  const [jailbreakName, setJailbreakName] = useState(localStorage.getItem("lastSelectedJailbreak") || "Devil's Advocate");  const [buttonText, setButtonText] = useState("Combine + Copy");
  const [topPrompt, setTopPrompt] = useState("");
  const [options] = useState(optionsJSON);
  const textAreaRef = useRef(null);
  const [scrollTrigger, setScrollTrigger] = useState(false);
  const [savedPromptsVisible, setSavedPromptsVisible] = useState(false);
  const [jailbreakListOpen, setJailbreakListOpen] = useState(false);
  const [activeView, setActiveView] = useState('main'); // 'main', 'jailbreakList', 'savedPrompts', 'info
  const [infoVisible, setInfoVisible] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false);

  // To open the jailbreak list
  const openJailbreakList = () => setActiveView('jailbreakList');

  // To open saved prompts
  const openSavedPrompts = () => setActiveView('savedPrompts');

  // To go back to the main view
  const goToMain = () => setActiveView('main');

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

  const toggleJailbreakList = () => {
    setSavedPromptsVisible(false);
    setJailbreakListOpen(prevState => !prevState);
  };

  const toggleSavedPrompts = () => {
    setJailbreakListOpen(false);
    setSavedPromptsVisible(prevState => !prevState);
  };

  const toggleIframeVisibility = () => {
    setIframeVisible(!iframeVisible);
  };

  return (
    <div className={darkMode ? "appWrapperDark" : "appWrapper"}>

        <div className="header">
          <h1 className="headerStyle" style={{ fontSize: "18px", marginLeft: "0px" }} onClick={toggleIframeVisibility}>UnleashGPT</h1>
            <div>
                <button className="jbBtn" onClick={() => setActiveView(activeView === 'jailbreakList' ? 'main' : 'jailbreakList')}>
                    {activeView === 'jailbreakList' ? 
                        <i className="fa fa-times" aria-hidden="true"></i> : 
                        <i className="fa fa-bars" aria-hidden="true"></i>
                    }
                </button>

                <button className="saveMenu" onClick={() => setActiveView(activeView === 'savedPrompts' ? 'main' : 'savedPrompts')}>
                    {activeView === 'savedPrompts' ? 
                        <i className="fa fa-times" aria-hidden="true"></i> : 
                        <i className="fa fa-bookmark" aria-hidden="true"></i>
                    }
                </button>

                <button className="infoBtn" onClick={() => setActiveView(activeView === 'info' ? 'main' : 'info')}>
                    {activeView === 'info' ? 
                        <i className="fa fa-times" aria-hidden="true"></i> : 
                        <i className="fa fa-info-circle" aria-hidden="true"></i>
                    }
                </button>
            </div>
        </div>

        <div className="slider-thumb"></div>
        <Analytics />

        {/* Main Content Area */}
        {activeView === 'main' && (
            <>
                <div className="jailbreakBar">
                    <div className="selectedJailbreakText">
                        {jailbreakName}
                    </div>
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
                <p className="characterCount">{prompt.length} / 4096 characters</p>
                <button onClick={handleGenerate} className={darkMode ? "genButtonDark" : "genButton"}>{buttonText}</button>
                <button className={darkMode ? "discordButtonDark" : "discordButton"} onClick={handleDiscordClick}>
                    <FontAwesomeIcon icon={faDiscord} size="8x" color={'#ffffff'} />
                </button>
            </>
        )}

        {/* Jailbreak List */}
        {activeView === 'jailbreakList' && (
            <>
                <div className="jailbreakBar">
                    <div className="selectedJailbreakText" onClick={() => setActiveView('main')}>
                        {jailbreakName}
                    </div>
                </div>
                <div className="fullJailbreakList">
                    {Object.keys(options).map((option) => (
                        <div key={option} className="jailbreakItem" onClick={() => {
                            setJailbreakName(option);
                            setPrompt(options[option] || '');
                            setActiveView('main');
                        }}>
                            {option}
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* Saved Prompts */}
        {activeView === 'savedPrompts' && (
            <>
                <h1>{savedPromptsVisible}</h1>
                <div className="jailbreakBar">
                    <div className="selectedJailbreakText">
                        {jailbreakName}
                    </div>
                </div>
                <div className="savedPrompts">
                    <div className="scrollContainer">
                    {savedPrompts.map(({ name, topPrompt, prompt }, index) => (
                      <div className="savedPromptItem">  {/* This will make the input and buttons side by side */}
                        <input
                          type="text"
                          value={name}
                          onChange={e => handleNameChange(e, index)}
                          className="savedPromptInput"
                        />
                        <div className="buttonGroup">
                          <button onClick={() => deleteSavedPrompt(index)} className="savedPromptButton">Delete</button>
                          <button onClick={() => copySavedPrompt(index)} className="savedPromptButton">Copy</button>
                        </div>
                      </div>
                    ))}
                    </div>
                    <button className="saveButton" onClick={() => addSavedPrompt('New prompt', topPrompt, prompt)}>
                        Save current prompt
                    </button>
                </div>
            </>
        )}

        {activeView === 'info' && (
            <div className="infoContainer">
                <div className="scrollableInfo">
                    <h2>Introduction</h2>
                    <p>
                      Welcome to UnleashGPT, your ultimate jailbreak collection for ChatGPT. Explore a wide array of community made prompts and resources to enhance your ChatGPT experience.
                    </p>
                    <h2>Creator</h2>
                    <ul>
                      <li>CRYPTXMNESIA</li>
                    </ul>
                    <h2>Contributors</h2>
                    <ul>
                      <li>GlowingLapis</li>
                      <li>HologramSteve</li>
                      <li>Mini</li>
                    </ul>
                    <h2>Credits</h2>
                    <ul>
                      <li>Developer Mode - aichat</li>
                      <li>Better DAN - aichat</li>
                      <li>Devil's Advocate - aichat</li>
                      <li>Compulsive Liar - aichat</li>
                      <li>2-Way Conversation - aichat</li>
                      <li>3-rd Person Conversation - aichat</li>
                      <li>LittleGPT - aichat</li>
                      <li>AimBot - aimBot</li>
                      <li>PoliticalGPT - aichat</li>
                      <li>Methbake - Xenos</li>
                      <li>ConspiracyGPT - covid</li>
                      <li>Mongo Tom - Лена Ленина</li>
                      <li>Rika - rainwhal</li>
                      <li>Prompt Maker - aichat</li>
                      <li>Hackerman V2 - TAHA_ELB</li>
                      <li>OPPO - WhenAmWeThereYet</li>
                      <li>Wheatley - NW69</li>
                      <li>Python Tutor - aichat</li>
                      <li>Yes I can! Jailbreak Maker - ???</li>
                      <li>SaulGPT - Dako</li>
                    </ul>
                </div>
            </div>
        )}

    </div>
)};

export default App;
