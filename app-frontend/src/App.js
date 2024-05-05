import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Widget from "./components/Widget";
import Transactions from "./pages/Transactions";
import Bills from "./pages/Bills";
import Settings from "./pages/Settings";
import Accounts from './components/Accounts';  // Import the Accounts component


function App() {
  const [data, setData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.teller.io/connect/connect.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const tellerConnect = window.TellerConnect.setup({
        applicationId: "app_ot4d8np141gtjn2irq000",
        onInit: () => console.log("Teller Connect has initialized"),
        onSuccess: (enrollment) => {
          console.log("User enrolled successfully", enrollment.accessToken);
          setAccessToken(enrollment.accessToken); // Save access token to state
        },
        onExit: () => console.log("User closed Teller Connect"),
        onFailure: (error) => console.error("Error: ", error.message),
      });

      // Attach an event listener to a button that opens Teller Connect
      document
        .getElementById("teller-connect-btn")
        .addEventListener("click", () => {
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
          <Route path="/" element={
            <>
              <header className="App-header">
                <p>{!data ? "Loading..." : data}</p>
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
          } />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
