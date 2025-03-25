import { useState, useEffect } from "react";

const QUOTE_STORAGE_KEY = "last_quote_date";

export function useDailyQuote() {
  const [showQuote, setShowQuote] = useState(false);

  useEffect(() => {
    checkAndShowDailyQuote();
  }, []);

  const checkAndShowDailyQuote = () => {
    const today = new Date().toDateString();
    const lastQuoteDate = localStorage.getItem(QUOTE_STORAGE_KEY);

    if (lastQuoteDate !== today) {
      localStorage.setItem(QUOTE_STORAGE_KEY, today);
      setShowQuote(true);
    }
  };

  return {
    showQuote,
    setShowQuote,
  };
} 