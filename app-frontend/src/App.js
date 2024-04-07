import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Notice the 'Routes' import
import "./App.css";
import Navbar from "./components/Navbar";
import Transactions from "./pages/Transactions"; // Import Transactions component
import Bills from "./pages/Bills"; // Import Bills component
import Settings from "./pages/Settings"; // Import Settings component

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
        <Routes>
          <Route
            path="/"
            element={
              <header className="App-header">
                <p>{!data ? "Loading..." : data}</p>
              </header>
            }
            exact
          />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
