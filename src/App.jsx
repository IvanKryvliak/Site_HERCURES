import { lazy, Suspense, useState, useEffect } from "react";
import HomePage from "./pages/HomePage";

const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const OwnerVisitPage = lazy(() => import("./pages/OwnerVisitPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));

/* Jednoduché přepínání stránek bez knihoven: web na "/", analýza na "/#/analytics" */
export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  if (hash === "#/analytics") return <Suspense fallback={null}><AnalyticsPage /></Suspense>;
  if (hash === "#/privacy") return <Suspense fallback={null}><PrivacyPage /></Suspense>;
  if (hash === "#/ignore") return <Suspense fallback={null}><OwnerVisitPage ignore /></Suspense>;
  if (hash === "#/count") return <Suspense fallback={null}><OwnerVisitPage ignore={false} /></Suspense>;
  return <HomePage />;
}
