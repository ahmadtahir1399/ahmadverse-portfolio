"use client";

import { useEffect, useState } from "react";

/**
 * Viewer's local clock, e.g. "02:47 AM GMT+5". Empty on the first render so
 * the server and client markup match, then filled in after mount.
 */
export const useLocalTime = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const clock = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const offsetMin = -now.getTimezoneOffset();
      const sign = offsetMin >= 0 ? "+" : "-";
      const hours = Math.floor(Math.abs(offsetMin) / 60);
      const mins = Math.abs(offsetMin) % 60;
      const gmt = `GMT${sign}${hours}${
        mins ? `:${String(mins).padStart(2, "0")}` : ""
      }`;

      setTime(`${clock} ${gmt}`);
    };

    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return time;
};
