import { create } from "zustand";

// 1. localStorage.getItem("chat-theme"):

// This retrieves the value associated with the key "chat-theme" from the browser's localStorage.
// If a value is found, it will return the value (e.g., "light", "dark").

// 2. || "coffee":

// The logical OR operator (||) is used as a fallback.
// If localStorage.getItem("chat-theme") returns null (meaning no value is stored for "chat-theme"), the variable will be assigned the default value "coffee".

// 3. theme:

// This initializes the theme variable with the retrieved or default value.






export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));