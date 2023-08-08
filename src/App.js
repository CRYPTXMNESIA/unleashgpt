import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setIframeHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: iframeHeight + 'px', // Use the dynamically calculated height
    border: 'none',
  };

  return (
    <>
    <Analytics />
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <iframe
          title="ugpt2.0"
          src="./ugpt2.0/index.html"
          style={iframeStyle} />
      </div>
    </>
  );
};

export default App;
