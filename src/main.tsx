import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Workspace from "./workspace/index.tsx";
import Project from "./workspace/project/index.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/workspace",
    element: <Workspace />,
    children: [{ path: "project/:projectId", element: <Project /> }],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
