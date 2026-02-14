import React from "react";
import ReactDOM from "react-dom/client";
import { createHead } from "unhead";
import { HeadProvider } from "@unhead/react";
import App from "./App";

const head = createHead();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeadProvider head={head}>
      <App />
    </HeadProvider>
  </React.StrictMode>
);