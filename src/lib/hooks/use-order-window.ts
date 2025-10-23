"use client";

import { useState, useEffect } from 'react';

// Order window is between 3:00 PM and 3:30 PM
const ORDER_WINDOW_START_HOUR = 15;
const ORDER_WINDOW_END_MINUTE = 30;

export function useOrderWindow() {
  const [status, setStatus] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "Initializing...",
  });

  useEffect(() => {
    const checkWindow = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const isWindowOpen = currentHour === ORDER_WINDOW_START_HOUR && currentMinute < ORDER_WINDOW_END_MINUTE;

      const message = isWindowOpen
        ? "Order window is open until 3:30 PM."
        : "Ordering is closed. Please check back between 3:00 PM and 3:30 PM.";

      setStatus({ isOpen: isWindowOpen, message });
    };

    checkWindow();
    const timer = setInterval(checkWindow, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  return status;
}
