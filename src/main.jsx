import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createHead, UnheadProvider } from "@unhead/react/client";
import { ThemeProvider } from "./context/ThemeContext"; // <-- adjust path if needed
import App from "./App";
import "./index.css";

const head = createHead();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UnheadProvider head={head}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </UnheadProvider>
  </React.StrictMode>
);