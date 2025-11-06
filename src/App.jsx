// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import RecipeDash from "./pages/RecipeDash.jsx";
import Checkout from "./pages/Checkout.jsx";
import Onboarding from "./pages/Onboarding.jsx";

function App() {
  const { isLoading } = useAuth0();
  if (isLoading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipes" element={<RecipeDash />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/info" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
