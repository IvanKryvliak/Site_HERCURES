import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";

/* Jednoduché přepínání stránek bez knihoven: web na "/", analýza na "/#/analytics" */
export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return hash === "#/analytics" ? <AnalyticsPage /> : <HomePage />;
}
