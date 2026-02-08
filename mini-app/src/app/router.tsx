import { createBrowserRouter } from "react-router-dom";

import CollectionPage from "../pages/CollectionPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SettingsPage from "../pages/SettingsPage";
import ProtectedRoute from "../shared/auth/ProtectedRoute";
import Layout from "../shared/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "collection",
        element: (
          <ProtectedRoute>
            <CollectionPage />
          </ProtectedRoute>
        ),
      },
      { path: "profile", element: <ProfilePage /> },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
