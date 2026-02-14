import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { createHead, UnheadProvider } from "@unhead/react/client";

const head = createHead();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UnheadProvider head={head}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UnheadProvider>
  </React.StrictMode>
);
