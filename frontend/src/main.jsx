import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { QuotationProvider } from "./context/QuotationContext";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import "./i18n/i18n.js";

createRoot(document.getElementById("root")).render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <QuotationProvider>
          <App />
        </QuotationProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
