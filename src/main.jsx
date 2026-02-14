import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { createHead, HeadProvider } from "@unhead/react/client";

const head = createHead();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeadProvider head={head}>
      <App />
    </HeadProvider>
  </React.StrictMode>
);