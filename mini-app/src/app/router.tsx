import { createBrowserRouter } from "react-router-dom";

import Layout from "../shared/components/Layout";
import ErrorFallback from "../shared/components/ErrorFallback";
import HomePage from "../pages/HomePage/HomePage";
import LibraryPage from "../pages/LibraryPage/LibraryPage";
import CreatePageGuard from "../pages/CreateTalePage/CreatePageGuard";
import CreateTaleDesignPage from "../pages/CreateTalePage/CreateTaleDesignPage";
import TaleGenerationPage from "../pages/TaleGenerationPage/TaleGenerationPage";
import TalePlayerPage from "../pages/TalePlayerPage/TalePlayerPage";
import CollectionPage from "../pages/CollectionPage/CollectionPage";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import SubscriptionPage from "../pages/SubscriptionPage/SubscriptionPage";
import HelpPage from "../pages/HelpPage/HelpPage";
import LimitReachedPage from "../pages/LimitReachedPage/LimitReachedPage";
import TermsPage from "../pages/TermsPage/TermsPage";
import PrivacyPage from "../pages/PrivacyPage/PrivacyPage";
import RewardsPage from "../pages/RewardsPage/RewardsPage";
import TaleOfTheDayPage from "../pages/TaleOfTheDayPage/TaleOfTheDayPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorFallback />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/library", element: <LibraryPage /> },
      { path: "/create", element: <CreatePageGuard /> },
      { path: "/_create-design", element: <CreateTaleDesignPage /> },
      { path: "/create/loading", element: <TaleGenerationPage /> },
      { path: "/tale/:id", element: <TalePlayerPage /> },
      { path: "/collection", element: <CollectionPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/subscription", element: <SubscriptionPage /> },
      { path: "/help", element: <HelpPage /> },
      { path: "/limit", element: <LimitReachedPage /> },
      { path: "/terms", element: <TermsPage /> },
      { path: "/privacy", element: <PrivacyPage /> },
      { path: "/rewards", element: <RewardsPage /> },
      { path: "/tale-of-the-day", element: <TaleOfTheDayPage /> },
    ],
  },
]);

// Для отладки маршрутов в dev-консоли
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log(
    "[skazka-mini-app] Registered routes:",
    (router.routes[0] as any)?.children?.map((r: any) => r.path),
  );
}

