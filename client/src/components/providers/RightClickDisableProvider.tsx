"use client";

import { useEffect } from "react";

export default function RightClickDisableProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Right click disable करने के लिए
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Developer Tools और Inspect Shortcuts disable करने के लिए
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 key
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect Element & Console)
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C", "i", "j", "c"].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Ctrl+U / Cmd+U (View Source Code)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
      }

      // Ctrl+S / Cmd+S (Save Page) - optionally disable करना चाहें तो
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
      }
    };

    // Event listeners add करना
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listeners
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}