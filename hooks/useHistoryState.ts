import { useState, useCallback, useMemo } from 'react';

/**
 * A custom hook to manage state with a history for undo/redo functionality.
 * @param initialValue The initial value of the state.
 * @returns An object with the current value, functions to set value, undo, redo, and booleans indicating if undo/redo is possible.
 */
export const useHistoryState = (initialValue: string) => {
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const value = useMemo(() => history[currentIndex], [history, currentIndex]);

  const setValue = useCallback((newValue: string) => {
    // Optimization to prevent state updates if the value is the same.
    if (newValue === value) {
      return;
    }

    // Create a new history from the beginning up to the current index,
    // effectively discarding any "redo" states.
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex, value]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }, [currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentIndex, history.length]);

  const canUndo = useMemo(() => currentIndex > 0, [currentIndex]);
  const canRedo = useMemo(() => currentIndex < history.length - 1, [currentIndex, history.length]);

  return { value, setValue, undo, redo, canUndo, canRedo };
};

export default useHistoryState;
