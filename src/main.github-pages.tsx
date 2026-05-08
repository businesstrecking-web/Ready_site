import { RouterProvider } from "@tanstack/react-router";
import { createHashHistory } from "@tanstack/history";
import { createRoot } from "react-dom/client";
import { getRouter } from "./router";
import "./styles.css";

const isGitHubPages = window.location.hostname.endsWith("github.io");

if (!isGitHubPages && window.location.hash.startsWith("#/")) {
  const hashPath = window.location.hash.slice(1);
  window.history.replaceState(null, "", hashPath || "/");
}

const router = getRouter(isGitHubPages ? { history: createHashHistory() } : undefined);

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(<RouterProvider router={router} />);
