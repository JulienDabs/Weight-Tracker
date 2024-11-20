import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AuthProvider from "./components/auth/AuthContext.tsx";
import { AuthStateProvider } from "./components/auth/AuthStateContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthStateProvider>
        <App />
      </AuthStateProvider>
    </AuthProvider>
  </React.StrictMode>
);
