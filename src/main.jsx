import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/ios-glass.css";
import "./asistente/orstty/orstty-training.js";
import { registerAllRastroTools } from "./asistente/orstty/rastro-tools.js";

// Inicializar catálogo de herramientas RASTRO para ORSTTY ENGINE
registerAllRastroTools();

import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);