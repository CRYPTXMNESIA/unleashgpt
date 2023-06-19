import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './JailbreakSelector.css'; // remember to create this file

const JailbreakSelector = ({ jailbreaks, selected, onSelect }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hoveredJailbreak, setHoveredJailbreak] = useState("");

  return (
    <div className="jailbreakSelector">
      <button onClick={() => setShowOptions(!showOptions)}>
        {selected}
      </button>
      <CSSTransition
        in={showOptions}
        timeout={300}
        classNames="fade"
        unmountOnExit
      >
        <div className="options">
          <div className="scrollable">
            {jailbreaks.map((jailbreak) => (
              <div
                key={jailbreak.name}
                onClick={() => {
                  onSelect(jailbreak.name);
                  setShowOptions(false);
                }}
                onMouseEnter={() => setHoveredJailbreak(jailbreak.name)}
                onMouseLeave={() => setHoveredJailbreak("")}
              >
                {jailbreak.name}
              </div>
            ))}
          </div>
          <div className="description">
            {jailbreaks.find((j) => j.name === hoveredJailbreak)?.description || ""}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default JailbreakSelector;