import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Widget from "./components/Widget";
import Transactions from "./pages/Transactions";
import Bills from "./pages/Bills";
import Settings from "./pages/Settings";
import Accounts from './components/Accounts';  // Import the Accounts component
import { ACCESS_TOKEN_KEY, APP_CONFIG } from './config/constants';

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN_KEY) || null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.teller.io/connect/connect.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const tellerConnect = window.TellerConnect.setup({
        applicationId: APP_CONFIG.applicationId,
        onInit: () => console.log("Teller Connect has initialized"),
        onSuccess: (enrollment) => {
          console.log("User enrolled successfully", enrollment.accessToken);
          setAccessToken(enrollment.accessToken); // Save access token to state
          localStorage.setItem(ACCESS_TOKEN_KEY, enrollment.accessToken);
        },
        onExit: () => console.log("User closed Teller Connect"),
        onFailure: (error) => console.error("Error: ", error.message),
      });

      document.getElementById("teller-connect-btn").addEventListener("click", () => {
        tellerConnect.open();
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <header className="App-header">
                    <button id="teller-connect-btn">
                      Connect to your bank
                    </button>
                  </header>
                  <Widget
                    title="Accounts"
                    leftContent="Checking Account"
                    rightContent="Savings Account"
                  />
                  {accessToken && <Accounts accessToken={accessToken} />}
                </>
              }
            />
            <Route path="/transactions" element={<Transactions accessToken={accessToken} />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
