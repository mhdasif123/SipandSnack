"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function CurrentTime() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      {format(time, "eeee, MMMM do, yyyy 'at' h:mm:ss a")}
    </>
  );
}
