import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import CaseStudyPage from "./pages/CaseStudyPage.tsx";

const router = createBrowserRouter([
  {
    element: (
      <>
        <Outlet />
        <ScrollRestoration />
      </>
    ),
    children: [
      { index: true, element: <App /> },
      { path: "work/:slug", element: <CaseStudyPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
