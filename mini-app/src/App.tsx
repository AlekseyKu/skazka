import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/router";
import { AppProviders } from "./app/providers";
import SplashPage from "./pages/SplashPage";

const SPLASH_DURATION_MS = 2800;

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return <SplashPage />;
  }

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

