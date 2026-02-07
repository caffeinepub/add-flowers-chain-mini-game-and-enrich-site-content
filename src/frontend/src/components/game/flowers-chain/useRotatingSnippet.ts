import { useState, useEffect } from 'react';
import { getRandomSnippet } from './wellnessSnippets';

const ROTATION_INTERVAL = 30000; // 30 seconds

export function useRotatingSnippet() {
  const [snippet, setSnippet] = useState(getRandomSnippet().text);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnippet(getRandomSnippet().text);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const rotateNow = () => {
    setSnippet(getRandomSnippet().text);
  };

  return { snippet, rotateNow };
}
