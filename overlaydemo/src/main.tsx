import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const overlayRoot = document.getElementById("overlay-root");
if (overlayRoot) {
  createRoot(overlayRoot).render(<App />);
}
