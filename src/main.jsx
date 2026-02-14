import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { createHead, UnheadProvider } from "@unhead/react/client";

const head = createHead();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UnheadProvider head={head}>
      <App />
    </UnheadProvider>
  </React.StrictMode>
);