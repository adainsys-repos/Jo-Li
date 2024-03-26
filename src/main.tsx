import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/signin/SignIn.tsx";
import Auth from "./auth/Auth.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route element={<Auth />}>
            <Route path="/" element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  </React.StrictMode>
);
