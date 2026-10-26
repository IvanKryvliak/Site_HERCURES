import { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import OwnerVisitPage from "./pages/OwnerVisitPage";
import PrivacyPage from "./pages/PrivacyPage";

/* Jednoduché přepínání stránek bez knihoven: web na "/", analýza na "/#/analytics" */
export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  if (hash === "#/analytics") return <AnalyticsPage />;
  if (hash === "#/privacy") return <PrivacyPage />;
  if (hash === "#/ignore") return <OwnerVisitPage ignore />;
  if (hash === "#/count") return <OwnerVisitPage ignore={false} />;
  return <HomePage />;
}
