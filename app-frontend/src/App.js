import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Widget from "./components/Widget"; // Import the Widget component
import Transactions from "./pages/Transactions";
import Bills from "./pages/Bills";
import Settings from "./pages/Settings";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
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
                    <p>{!data ? "Loading..." : data}</p>
                  </header>
                  {/* Add the Widget component below the header */}
                  <Widget
                    title="Accounts"
                    leftContent="Checking Account"
                    rightContent="Savings Account"
                  />
                </>
              }
            />
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
