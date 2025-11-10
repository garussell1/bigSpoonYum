// src/App.jsx
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Home }  from "./pages/Home";
import { NotFound }  from "./pages/NotFound";
import  Dashboard from "./pages/Dashboard.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import { RecipeDash } from "./pages/RecipeDash";
import { Checkout } from "./pages/Checkout";
import { Onboarding } from "./pages/Onboarding";

function App() {
  const { isLoading } = useAuth0();
  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipes" element={<RecipeDash />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/info" element={<Onboarding />} />
      </Routes>
    </Router>
  );
}

export default App;
